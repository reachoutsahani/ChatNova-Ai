const response = await fetch(`${API_URL}/api/chat/test`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(requestBody),
});

if (!response.ok) {
  throw new Error(`Server Error: ${response.status}`);
}

const data = await response.json();

const aiResponse = data.reply || data.message || "No response";

setMessages((prev) =>
  prev.map((msg) =>
    msg.id === aiMessageId
      ? { ...msg, content: aiResponse }
      : msg
  )
);