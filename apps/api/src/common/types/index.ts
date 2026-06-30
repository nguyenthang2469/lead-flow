export type TFacebookWebhookPayload = {
  object: 'page';
  entry: {
    id: string;
    time: number;
    messaging: {
      sender: { id: string };
      recipient: { id: string };
      message: {
        mid: string;
        text: string;
        is_echo: boolean;
      };
      postback?: {
        title: string;
        payload: string;
      };
    }[];
  }[];
};
