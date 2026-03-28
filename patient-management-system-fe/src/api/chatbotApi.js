import axiosClient from "./axiosClient";

export const sendChatMessage = async (message) => {
  try {
    const response = await axiosClient.post("/chatbot/chat", { message });
    return response.data;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};
