export const reference = `tags (works anywhere, including nested):
  [bold]...[/bold]              bold text
  [italic]...[/italic]          italic text
  [code]...[/code]              code text
  [h1]...[/h1] through [h6]...[/h6]  headings

custom effects:
  [gradient colors=pink,violet direction=90deg]...[/gradient]
  [glitter color=gold]...[/glitter]
  [fire]...[/fire]
  [neon color=#ff00ff]...[/neon]
  [shadow color=#333 x=3px y=3px blur=2px]...[/shadow]
  [outline color=red width=2]...[/outline]
  [wavy]...[/wavy]              (plain text children only)
  [shake]...[/shake]
  [strike color=red]...[/strike]
  [highlight color=yellow]...[/highlight]
  [color value=crimson]...[/color]
  [size size=2em]...[/size]
  [spoiler]...[/spoiler]
  [typewriter speed=60]...[/typewriter]   (plain text children only)

tags can be nested:
  [outline color=blue width=2][shadow color=#00f x=4px y=4px][h2]Heading[/h2][/shadow][/outline]

images:
  ![url]{wrap=left,shape=auto,width=300px,alt=description}
  wrap: left | right | center | break
  shape: auto | circle | polygon(x1 y1,x2 y2,...) | none`;
