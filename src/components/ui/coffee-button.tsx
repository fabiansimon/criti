import { cn } from "~/lib/utils";

interface CoffeeButtonProps {
  className?: string;
}
export default function CoffeeButton({ className }: CoffeeButtonProps) {
  return (
    <a target="_blank" href="https://www.buymeacoffee.com/fabiansimon">
      <img
        className={cn("h-9", className)}
        alt="buy me a coffee button"
        src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee?&emoji=&slug=fabiansimon&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff"
      />
    </a>
  );
}
