import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

// Returns a local file uri, or null if cancelled.
export async function pickImage(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true })
  return res.canceled ? null : res.assets[0].uri
}

// folder: 'avatars' | 'listings'. Stored under <folder>/<uid>/ so storage.rules can check ownership.
export async function uploadImage(folder: 'avatars' | 'listings', uid: string, uri: string): Promise<string> {
  const blob = await (await fetch(uri)).blob()
  const r = ref(storage, `${folder}/${uid}/${Date.now()}`)
  await uploadBytes(r, blob, { contentType: blob.type || 'image/jpeg' })
  return getDownloadURL(r)
}
