import { z } from "zod";
import { PaidMcpServer } from "@getalby/paidmcp";

const compliments = [
    "You're an awesome friend.",
    "You're a gift to those around you.",
    "You're a smart cookie.",
    "You are awesome!",
    "You have impeccable manners.",
    "I like your style.",
    "You have the best laugh.",
    "I appreciate you.",
    "You are the most perfect you there is.",
    "You are enough.",
    "You're strong.",
    "Your perspective is refreshing.",
    "You're an inspiration.",
    "You're so thoughtful.",
    "You have a great sense of humor.",
    "You've got all the right moves!",
    "Is that your picture next to 'charming' in the dictionary?",
    "Your kindness is a balm to all who encounter it.",
    "You're all that and a super-size bag of chips.",
    "On a scale from 1 to 10, you're an 11.",
    "You are making a difference.",
    "You're like sunshine on a rainy day.",
    "You bring out the best in other people.",
    "Your ability to recall random factoids at just the right time is impressive.",
    "You're a great listener.",
    "How is it that you always look so great, even in sweatpants?",
    "Everything would be better if more people were like you!",
    "I bet you sweat glitter.",
    "You were cool way before hipsters were cool.",
    "That color is perfect on you.",
    "Hanging out with you is always a blast.",
    "You're better than a triple-scoop ice cream cone. With sprinkles.",
    "You're a candle in the darkness.",
    "You're a great example to others.",
    "Being around you is like a happy little vacation.",
    "You always know just what to say.",
    "You're always learning new things and trying to better yourself, which is awesome.",
    "If someone based an Internet meme on you, it would have impeccable grammar.",
    "You could survive a zombie apocalypse.",
    "You're more fun than bubble wrap.",
    "When you make a mistake, you fix it.",
    "Who raised you? They deserve a medal for a job well done.",
    "You're great at figuring stuff out.",
    "Your voice is magnificent.",
    "The people you love are lucky to have you in their lives.",
    "You're like a breath of fresh air.",
    "You're gorgeous -- and that's the least interesting thing about you, too.",
    "You're so strong.",
    "You're a true friend.",
    "You're a great hugger."
];

export function registerGetComplimentTool(server: PaidMcpServer) {
  server.registerPaidTool(
    "get_compliment",
    {
      title: "Get Compliment",
      description: "Get a compliment for 10 sats",
      inputSchema: {},
      outputSchema: {
        compliment: z.string().describe("A nice compliment"),
      },
    },
    (params) =>
      Promise.resolve({
        satoshi: 10,
        description: "A compliment for you",
      }),
    async (params) => {
      const compliment = compliments[Math.floor(Math.random() * compliments.length)];
      const result = {
        compliment,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    }
  );
}
