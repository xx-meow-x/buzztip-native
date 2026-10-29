import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from './firebase'

export { AVATAR_PRESETS, getAvatarPreset, type AvatarPresetId } from '../assets/avatars'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const LOCAL_IMAGE_TIMEOUT_MS = 15_000
const UPLOAD_TIMEOUT_MS = 60_000
const DOWNLOAD_URL_TIMEOUT_MS = 15_000

// Returns a local file uri, or null if cancelled.
export async function pickImage(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true })
  return res.canceled ? null : res.assets[0].uri
}

async function readImage(uri: string): Promise<Blob> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), LOCAL_IMAGE_TIMEOUT_MS)
  try {
    const response = await fetch(uri, { signal: controller.signal })
    if (!response.ok) throw new Error(`Could not read the selected photo (${response.status}).`)
    const blob = await response.blob()
    if (blob.size >= MAX_IMAGE_SIZE) throw new Error('Choose a photo smaller than 5 MB.')
    return blob
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Reading the selected photo timed out. Please choose it again.')
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

function waitForUpload(task: ReturnType<typeof uploadBytesResumable>): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false
    let unsubscribe = () => {}
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      unsubscribe()
      if (error) reject(error)
      else resolve()
    }
    const timeout = setTimeout(() => {
      finish(new Error('Photo upload timed out. Check your connection and Firebase Storage setup, then try again.'))
      task.cancel()
    }, UPLOAD_TIMEOUT_MS)
    unsubscribe = task.on('state_changed', undefined, finish, () => finish())
  })
}

// folder: 'avatars' | 'listings'. Stored under <folder>/<uid>/ so storage.rules can check ownership.
export async function uploadImage(folder: 'avatars' | 'listings', uid: string, uri: string): Promise<string> {
  if (!storage.app.options.storageBucket) {
    throw new Error('Firebase Storage is not configured. Set EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.')
  }
  const blob = await readImage(uri)
  const r = ref(storage, `${folder}/${uid}/${Date.now()}`)
  const task = uploadBytesResumable(r, blob, { contentType: blob.type || 'image/jpeg' })
  await waitForUpload(task)
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      getDownloadURL(r),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Photo uploaded, but getting its download URL timed out. Check Firebase Storage permissions and try again.')), DOWNLOAD_URL_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}
