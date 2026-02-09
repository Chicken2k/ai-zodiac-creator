
import { GoogleGenAI } from "@google/genai";
import { ContentRequest } from "./types";
import { SYSTEM_PROMPT } from "./constants";

export const generateZodiacContent = async (request: ContentRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const userPrompt = `
    Hãy viết một kịch bản AUDIO tâm tình sâu sắc cho tuổi ${request.zodiac}.
    Tông giọng: ${request.tone}.
    Chủ đề trọng tâm: ${request.focus}.
    
    YÊU CẦU ĐỘ DÀI: Kịch bản phải dài khoảng 400 từ, đủ để đọc trong 2 phút với tốc độ thong thả.
    
    Yêu cầu nội dung:
    - Văn phong thấm thía như lời dặn của người Thầy.
    - Tập trung vào nỗi khổ tâm, sự hy sinh thầm lặng và đức tính lo toan.
    - Có đoạn kêu gọi tương tác giữa bài.
    - Nhắc đến vận khí năm 2026 ở đoạn kết.
    - VIẾT THÀNH CÁC ĐOẠN VĂN XUÔI, không liệt kê, có nhịp điệu audio rõ ràng.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.9,
        topP: 0.95,
      },
    });

    return response.text || "Thầy đang tịnh tâm chưa luận giải được. Con hãy thử lại sau nhé.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Lỗi kết nối với thiên cơ. Vui lòng thử lại!");
  }
};
