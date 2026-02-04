import Groq from 'groq-sdk';

class GroqService {
  constructor() {
    this.client = null;
  }

  initialize(apiKey) {
    this.client = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async chat(messages, dataContext = null) {
    if (!this.client) {
      throw new Error('Groq client not initialized. Please set your API key.');
    }

    try {
      const systemPrompt = dataContext
        ? `You are an expert data analyst assistant. You have access to the user's dataset with the following structure:

**Columns:** ${dataContext.headers.join(', ')}

**Sample Data (first 5 rows):**
${JSON.stringify(dataContext.preview, null, 2)}

Answer questions about this data, provide insights, suggest analyses, and help with data-driven decisions. Be concise and actionable.`
        : 'You are a helpful AI assistant specialized in data analytics.';

      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const completion = await this.client.chat.completions.create({
        messages: chatMessages,
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || 'No response generated.';
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error(error.message || 'Failed to get response from AI');
    }
  }

  async predictWithContext(targetColumn, features, dataContext) {
    if (!this.client) {
      throw new Error('Groq client not initialized.');
    }

    const prompt = `Based on the dataset with columns: ${dataContext.headers.join(', ')}, 
    predict the value of "${targetColumn}" given these feature values:
    ${JSON.stringify(features, null, 2)}

    Provide a realistic prediction with confidence score and brief reasoning.`;

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a predictive analytics expert.' },
          { role: 'user', content: prompt }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.5,
        max_tokens: 512,
      });

      return completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('Prediction Error:', error);
      throw error;
    }
  }
}

export default new GroqService();