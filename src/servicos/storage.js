import { storage } from '../config/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export async function salvarImagem(imagem, imagemNome) {
  if (!imagem) return;
  const downloadImg = await fetch(imagem);
  const bloImagem = await downloadImg.blob();
  const imagemRef = ref(storage, `post/${imagemNome}.png`);

  try {
    await uploadBytes(imagemRef, bloImagem);
    const url = await getDownloadURL(imagemRef);
    return url;
  }
  catch (error) {
    console.log(error)
    return null;
  }
}