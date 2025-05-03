
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
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the raw response text first
    const responseText = await response.text();
    
    // Log the raw response for debugging
    console.log('Raw webhook response:', responseText);
    
    // Check if the response is empty
    if (!responseText || responseText.trim() === '') {
      return 'Request processed successfully, but no response data was returned';
    }
    
    // Try to parse the response as JSON
    try {
      // Only try to parse if there's actual content
      const data = responseText ? JSON.parse(responseText) : null;
      
      // Better handling of response formats
      if (typeof data === 'string') {
        return data;
      } else if (data && typeof data.message === 'string') {
        return data.message;
      } else if (data && typeof data.output === 'string') {
        return data.output;
      } else if (Array.isArray(data) && data.length > 0) {
        return typeof data[0] === 'string' ? data[0] : 
               (data[0].message || data[0].output || 'Received response from webhook');
      } else if (data) {
        // Inspect the actual response structure for better handling
        console.log("Response data structure:", JSON.stringify(data));
        return 'Received structured response from webhook';
      } else {
        return 'Request processed successfully';
      }
    } catch (parseError) {
      // If we can't parse the response as JSON, return the raw text (truncated if too long)
      console.error('Error parsing JSON response:', parseError);
      
      // Return the raw text if it's reasonably sized, otherwise truncate it
      if (responseText.length <= 500) {
        return `Response: ${responseText}`;
      } else {
        // Truncate long responses
        return `Response: ${responseText.substring(0, 500)}... (truncated)`;
      }
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    
    // Improve error message for network-related errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. The webhook server might be unavailable.');
    } else if (error instanceof TypeError && error.message.includes('NetworkError')) {
      throw new Error('Network error: Cannot connect to the webhook. Please check your internet connection and webhook URL.');
    } else if (error instanceof SyntaxError && error.message.includes('JSON.parse')) {
      throw new Error('Invalid response format. The webhook did not return valid JSON data.');
    }
    
    throw error;
  }
};
