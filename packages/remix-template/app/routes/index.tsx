import styles from "~/styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Congratulations!</h1>
      <p>
        You’ve successfully created your <a target="_blank" href="https://remix.run/">Remix</a> project for <a target="_blank" href="https://developer.fastly.com/learning/compute/javascript/">Fastly Compute@Edge</a>.
      </p>
      <p>
        If you already have a Remix application that you'd like to move to Compute@Edge, see
        our <a target="_blank" href="https://github.com/fastly/remix-compute-js/blob/main/MIGRATING.md">migration guide</a>.
      </p>
      <p>
        To learn more about Remix, visit some pages:
      </p>
      <ul>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <p>
        The Compute@Edge Adapter for Remix is provided as part of <a target="_blank" href="https://developer.fastly.com/labs/">Fastly Labs</a>: where edge computing meets the cutting edge.
        Visit Fastly Labs for other exciting projects we provide under this program.
      </p>
      <p>
        Check out Fastly’s <a target="_blank" href="https://www.fastly.com/fast-forward">Fast Forward program</a> to learn more about our broad-reaching
        programs designed to empower and support open source projects, nonprofit organizations, and developers in their endeavors to build great things
        with unmatched ease, performance, and security.
      </p>
      <p>
        Enjoy!
      </p>
    </div>
  );
}
