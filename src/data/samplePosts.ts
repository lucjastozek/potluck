export interface Post {
  id: string;
  author: string;
  authorHeader: string;
  date?: string;
  markup: string;
}

export const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    author: "margot_w",
    authorHeader: "Margot 🌈",
    date: "2026-05-19",
    markup: `[h1]dog update!![/h1]

saw the raincoat dog again today. [bold]different raincoat.[/bold] [shake]different raincoat.[/shake]

[highlight color=var(--yellow)]i think she has a collection.[/highlight]

we made eye contact again. i feel like she knows something i don't.`,
  },
  {
    id: "3",
    author: "sunni.b",
    authorHeader: "sunni b",
    date: "2026-05-18",
    markup: `do penguins have knees? if yes, can they jump?

[typewriter speed=70]these are the things keeping me awake.[/typewriter]

[strike color=var(--red)]i am fine[/strike] [glitter color=var(--pink)]i am fine[/glitter]`,
  },
  {
    id: "2",
    author: "finn_o",
    authorHeader: "FINNEAS",
    date: "2026-05-19",
    markup: `[neon color=var(--green)][h2]hot take friday[/h2][/neon]

[outline color=var(--orange) width=2]cereal is just cold soup[/outline] and i will not be elaborating further

[wavy]have a great weekend everyone[/wavy]`,
  },
  {
    id: "4",
    author: "lena.k",
    authorHeader: "lena",
    date: "2026-05-18",
    markup: `[gradient colors=var(--peach),var(--yellow) direction=135deg][h1]recipe for a good tuesday[/h1][/gradient]

[bold]ingredients:[/bold]
— one (1) coffee, hot
— [highlight color=var(--yellow)]a playlist you forgot you made in 2019[/highlight]
— absolutely zero obligations before 10am
— [glitter color=var(--orange)]a small treat. you know the one.[/glitter]

[bold]method:[/bold] combine. do not rush. serves 1.

[color value=var(--darkGreen)][italic]adjust quantities based on how monday went[/italic][/color]`,
  },
  {
    id: "5",
    author: "theo.makes",
    authorHeader: "Theo Makes ⚒️",
    date: "2026-05-17",
    markup: `[shadow color=var(--darkBlue) x=3px y=3px blur=2px]i learned something today[/shadow]

cleopatra lived closer in time to the moon landing than to the building of the pyramids

[wavy]let that sink in[/wavy]

i had to lie down after finding this out. the floor was helpful.`,
  },
  {
    id: "6",
    author: "roisin.e",
    authorHeader: "roisin 🥀",
    date: "2026-05-17",
    markup: `[outline color=var(--red) width=2]a formal complaint[/outline]

to: the person who invented open-plan offices
from: me
re: [bold][shake]the sounds[/shake][/bold]

[highlight color=var(--peach)]exhibit a: keyboard typing. exhibit b: someone's lunch. exhibit c: a call on speakerphone.[/highlight]

i am requesting [rainbow]silence[/rainbow] or at minimum a cave.

[typewriter speed=55]thank you for your consideration.[/typewriter]`,
  },
];
