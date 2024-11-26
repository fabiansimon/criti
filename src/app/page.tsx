"use client";

import {
  CloudUploadIcon,
  MusicNote01Icon,
  Notification03Icon,
  Rocket01Icon,
  SentIcon,
} from "hugeicons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Text from "~/components/typography/text";
import BannerImage from "public/banner.png";
import LogoImage from "public/logo.svg";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~/constants/routes";
import { cn } from "~/lib/utils";
import Image from "next/image";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";

const LANDING_DATA = {
  title: "Transform Your Music with Pro-Level Feedback.",
  subtitle:
    "Easily upload your tracks, receive in-depth, timestamped critiques, and fine-tune your sound with insights crafted for professional growth.",
  steps: [
    {
      text: "Upload your track effortlessly",
      icon: <CloudUploadIcon className="text-white" />,
    },
    {
      text: "Share with fellow creators",
      icon: <SentIcon className="text-white" />,
    },
    {
      text: "Receive pinpoint feedback, down to the second",
      icon: <MusicNote01Icon className="text-white" />,
    },
    {
      text: "Stay ahead with instant revision alerts",
      icon: <Notification03Icon className="text-white" />,
    },
  ],
};

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const stepsRef = useRef<HTMLDivElement | null>(null);

  const isSmall = useBreakpoint(BREAKPOINTS.sm);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = scrollProgress / 10;
  const translateX = Math.min(scrollProgress * 10 - 100, 1);
  const translateY = -Math.min(scrollProgress * 20, 200);

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-gradient-to-t from-neutral-100 to-white no-scrollbar">
      <div
        className="fixed left-0 top-0 z-50 h-1 bg-neutral-950 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      <section className="relative flex h-[100vh] w-full grow flex-col bg-accent text-center">
        <div
          style={{ transform: isSmall ? "" : `translateY(${translateY}px)` }}
          className="mt-[400px] flex flex-col items-center justify-center"
        >
          <Image
            src={LogoImage as string}
            alt="logo"
            className="animate-fade-in-up mb-10"
          />
          <Text.Headline
            type="h1"
            className="animate-fade-in-up max-w-[90%] md:max-w-[50%]"
          >
            {LANDING_DATA.title}
          </Text.Headline>
          <Text.Body
            subtle
            className="text-md animate-fade-in-up mt-2 max-w-[90%] md:max-w-[50%]"
          >
            {LANDING_DATA.subtitle}
          </Text.Body>

          <div className="animate-fade-in-up mt-4 flex flex-col gap-2 md:flex-row">
            <Button
              onClick={() => router.push(ROUTES.auth)}
              icon={<Rocket01Icon size={18} className="animate-float" />}
              title="Get started"
              className="h-12 transition-transform hover:scale-105"
            />
            <Button
              title="Learn more"
              className="h-12 transition-transform hover:scale-105"
              variant="outline"
              onClick={() =>
                stepsRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            />
          </div>
        </div>
        {!isSmall && (
          <div
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
            className="pointer-events-none absolute bottom-[200px] mt-[200px] max-h-[300px] w-full"
          >
            <Image
              priority
              src={BannerImage}
              alt="mockup render"
              className="max-h-[300px] w-full object-contain"
            />
          </div>
        )}
      </section>
      <section
        ref={stepsRef}
        className="flex min-h-[100vh] w-full grow flex-col items-center justify-center bg-neutral-950 py-32 text-center"
      >
        <Text.Headline className="animate-fade-in-up text-white" type="h1">
          How does it work
        </Text.Headline>
        <Text.Body
          subtle
          className="text-md b animate-fade-in-up max-w-[40%] text-white/60"
        >
          {"It's really not that complicated..."}
        </Text.Body>

        <div className="mt-10">
          {LANDING_DATA.steps.map((step, index) => (
            <StepContainer key={index} step={step} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface Step {
  icon: React.ReactNode;
  text: string;
}

interface StepContainerProps {
  step: Step;
  index: number;
}

function StepContainer({ step, index }: StepContainerProps) {
  const { icon, text } = step;
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className={cn(
          "relative flex aspect-square h-[300px] w-[300px] flex-col items-center justify-center space-y-2 rounded-xl border border-white/10 transition-all duration-1000 ease-out md:max-w-[400px]",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
        )}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        <div className="absolute -top-[10px] bg-neutral-950 px-4">
          <Text.Subtitle className="text-sm text-white">{`Step #${index + 1}`}</Text.Subtitle>
        </div>
        {icon}
        <Text.Subtitle className="text-md mx-6 text-white">
          {text}
        </Text.Subtitle>
      </div>
      {index !== LANDING_DATA.steps.length - 1 && (
        <div
          className={cn(
            "mb-8 mt-5 h-[60px] border-r border-white/70 transition-all duration-1000 ease-out",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0",
          )}
          style={{
            borderStyle: "dashed",
            transitionDelay: `${index * 200}ms`,
          }}
        />
      )}
    </div>
  );
}
