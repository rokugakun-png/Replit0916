import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  sender: "user" | "character";
  content: string;
  timestamp: string;
}

interface TaskSuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  reasoning: string;
  category: "communication" | "self-care" | "goal-setting" | "behavioral" | "emotional";
}

export async function suggestTasksFromConversation(
  messages: ChatMessage[], 
  worryTitle: string,
  characterName: string
): Promise<TaskSuggestion[]> {
  try {
    const conversationText = messages
      .map(msg => `${msg.sender === "user" ? "ユーザー" : characterName}: ${msg.content}`)
      .join("\n");

    const prompt = `
あなたは心理カウンセラーのアシスタントです。以下の相談者とカウンセラーの会話を分析し、相談者の状況に適した具体的で実行可能なタスクを提案してください。

**悩みのテーマ**: ${worryTitle}

**会話内容**:
${conversationText}

**重要な配慮事項**:
- うつ病や不安を抱える方に配慮し、小さく達成しやすいタスクを提案
- 無理のない範囲で段階的に進められる内容
- 相談者の現在の状況や感情を考慮
- 批判的でなく、肯定的で支援的な表現を使用

以下のJSON形式で1-3個のタスクを提案してください:
{
  "suggestions": [
    {
      "title": "具体的で短い行動タイトル（20文字以内）",
      "description": "タスクの詳細説明と取り組み方のアドバイス",
      "priority": "low|medium|high のいずれか",
      "reasoning": "なぜこのタスクを提案するかの理由",
      "category": "communication|self-care|goal-setting|behavioral|emotional のいずれか"
    }
  ]
}
`;

    console.log("Sending request to OpenAI for task suggestions");
    
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "あなたは経験豊富な心理カウンセラーのアシスタントです。相談者の心理状態を理解し、適切で実行可能なタスクを提案することが得意です。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2000
    });

    console.log("OpenAI response received. Choices count:", response.choices?.length);
    console.log("Finish reason:", response.choices[0]?.finish_reason);
    console.log("Content length:", response.choices[0]?.message?.content?.length || 0);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("Empty response from OpenAI. Full response:", response);
      console.error("Finish reason:", response.choices[0]?.finish_reason);
      
      // フォールバック応答を提供
      return [
        {
          title: "今日一つだけ好きなことをする",
          description: "5分でもよいので、あなたが楽しいと感じることを一つだけしてみてください。音楽を聴く、好きな飲み物を飲む、窓の外を見るなど、何でも構いません。",
          priority: "low" as const,
          reasoning: "小さな楽しみを見つけることで、気持ちが少し軽くなる可能性があります。",
          category: "self-care" as const
        }
      ];
    }
    
    try {
      const result = JSON.parse(content);
      return result.suggestions || [];
    } catch (parseError) {
      console.error("Failed to parse OpenAI JSON response:", parseError);
      // フォールバック応答を提供
      return [
        {
          title: "今日一つだけ好きなことをする",
          description: "5分でもよいので、あなたが楽しいと感じることを一つだけしてみてください。音楽を聴く、好きな飲み物を飲む、窓の外を見るなど、何でも構いません。",
          priority: "low" as const,
          reasoning: "小さな楽しみを見つけることで、気持ちが少し軽くなる可能性があります。",
          category: "self-care" as const
        }
      ];
    }

  } catch (error) {
    console.error("AI task suggestion failed:", error);
    throw new Error("タスクの提案中にエラーが発生しました。しばらく後にもう一度お試しください。");
  }
}

export async function analyzeMoodFromConversation(
  messages: ChatMessage[]
): Promise<{
  mood: string;
  confidence: number;
  supportiveMessage: string;
}> {
  try {
    const conversationText = messages
      .map(msg => `${msg.sender === "user" ? "ユーザー" : "カウンセラー"}: ${msg.content}`)
      .join("\n");

    const prompt = `
以下の会話から相談者の気持ちや心理状態を分析し、適切な励ましのメッセージを考えてください。

**会話内容**:
${conversationText}

以下のJSON形式で回答してください:
{
  "mood": "相談者の気持ちを一言で表現（例：少し不安、前向き、疲れている）",
  "confidence": 0.0-1.0の信頼度,
  "supportiveMessage": "相談者に寄り添う短い励ましのメッセージ（30文字以内）"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "あなたは共感的で温かい心理カウンセラーです。相談者の気持ちを理解し、適切な励ましを提供することができます。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 300
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("AIからの応答が空でした");
    }
    
    const result = JSON.parse(content);
    return result;

  } catch (error) {
    console.error("Mood analysis failed:", error);
    return {
      mood: "お疲れ様",
      confidence: 0.5,
      supportiveMessage: "今日もお疲れ様でした。あなたのペースで大丈夫です。"
    };
  }
}