import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

function Mark() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden>
      <circle cx="21.5" cy="29" r="9.5" fill="none" stroke="currentColor" strokeWidth="7" />
      <polygon points="31,14.5 38,8 38,40 31,40" fill="currentColor" />
    </svg>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Mark />
          {appName}
        </>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
