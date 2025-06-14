import { GoogleGenAI } from "@google/genai";
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  try{
    /* 0. 檢查 & 取出 API Key ------------------------------------------ */
    const { geminiApiKey } = useRuntimeConfig()
    if (!geminiApiKey) {
      throw createError({ statusCode: 500, statusMessage: '缺少 GEMINI_API_KEY' })
    }
    const ai = new GoogleGenAI({ apiKey: geminiApiKey })
  
    /* 1. 讀取上傳的音檔（multipart/form-data） ------------------------- */
    const form = await readMultipartFormData(event)
    const file = form?.find((p) => p.name === 'audio')
    if (!file) {
      throw createError({ statusCode: 400, statusMessage: '請用 audio 欄位上傳檔案' })
    }
  
    const base64Audio = file.data.toString('base64')
  
    /* 2. 組 Gemini 請求內容 ------------------------------------------ */
    const contents = [
      { text: 'Please transcribe only the English alphabet letters heard in the audio, ignore everything else, and return each letter in lowercase on a separate line with no explanation or punctuation.' },         // 系統或使用者提示，可改繁中
      {
        inlineData: {
          mimeType: 'audio/mp3',
          data: base64Audio
        }
      }
    ]
  
    /* 3. 呼叫 Gemini ------------------------------------------------- */
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: contents
    })
    if (!file?.data) {
      throw createError({
        statusCode: 400,
        statusMessage: '未收到 audio 檔案，請用 multipart/form-data 上傳',
      })
    }
    /* 4. 回傳 JSON 結果 --------------------------------------------- */
    return { text: response.text }
  } catch(err) {
    const e = err as Error
    console.error(e)
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})