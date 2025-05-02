
// Send message to webhook
export const sendToWebhook = async (
  webhookUrl: string,
  message: string | undefined,
  files: File[] | undefined,
  chatId: string
): Promise<string> => {
  try {
    if (!webhookUrl) {
      throw new Error('Webhook URL is not set');
    }

    const formData = new FormData();
    formData.append('chatId', chatId);
    
    if (message) {
      formData.append('message', message);
    }
    
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Better handling of response formats
    if (typeof data === 'string') {
      return data;
    } else if (data && typeof data.message === 'string') {
      return data.message;
    } else if (data && typeof data.output === 'string') {
      return data.output;
    } else if (Array.isArray(data) && data.length > 0) {
      return typeof data[0] === 'string' ? data[0] : 
             (data[0].message || data[0].output || 'Received response from n8n');
    } else {
      // Inspect the actual response structure for better handling
      console.log("Response data structure:", JSON.stringify(data));
      return 'Received response from n8n';
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};
