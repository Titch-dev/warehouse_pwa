import Head from "next/head";
import styles from "./privacy-policy.module.css";
import { rubikFont } from "@/lib/fonts";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | The Westville Warehouse</title>
      </Head>

      <main className={styles.container}>
        <h1 className={`${styles.heading} ${rubikFont.className}`}>Privacy Policy</h1>

        <p className={styles.paragraph}>
          <strong>Effective Date:</strong> March 4, 2026
        </p>

        <p className={styles.paragraph}>
          The Westville Warehouse (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
          protecting your privacy and handling any personal information in
          accordance with the Protection of Personal Information Act, 2013 (POPIA).
        </p>

        <h2 
          className={`${styles.subheading} ${rubikFont.className}`}
        >
          1. Personal Information
        </h2>
        <p className={styles.paragraph}>
          We do not collect or store personal information directly through this website.
        </p>
        <p className={styles.paragraph}>
          If you choose to contact us via email using the provided mail link,
          your email address and any information you include will be processed
          by your email provider and received by us in the normal course of
          email communication.
        </p>

        <h2 
          className={`${styles.subheading} ${rubikFont.className}`}
        >
          2. Cookies
        </h2>
        <p className={styles.paragraph}>
          We use limited cookies to ensure the website functions correctly and
          to remember your cookie preferences.
        </p>
        <p className={styles.paragraph}>
          With your consent, we may also use analytics cookies to understand how
          visitors interact with our website so we can improve content and usability.
        </p>

        <h2 
          className={`${styles.subheading} ${rubikFont.className}`}
        >
          3. Analytics
        </h2>
        <p className={styles.paragraph}>
          If you choose to enable analytics, we use Firebase/Google Analytics to
          collect anonymised usage data such as pages viewed, approximate device
          type, and interaction patterns. This information is used only to
          improve website performance and user experience.
        </p>
        <p className={styles.paragraph}>
          Analytics cookies are only activated if you provide consent. You may
          withdraw consent at any time by using the &quot;Cookie settings&quot; link in
          the website footer.
        </p>

        <h2 
          className={`${styles.subheading} ${rubikFont.className}`}
        >
          4. Event Photography & Media
        </h2>
        <p className={styles.paragraph}>
          Photographs and videos may be taken at events hosted at The Westville Warehouse.
          These images may be used on our website, social media platforms, or other promotional materials.
        </p>

        <p className={styles.paragraph}>
          Where individuals are clearly identifiable in published images, this may constitute
          personal information under POPIA.
        </p>

        <p className={styles.paragraph}>
          If you appear in an image published by us and would prefer that it be removed,
          please contact us using the details below. We will review and, where appropriate,
          remove the image within a reasonable timeframe.
        </p>

        <h2 
          className={`${styles.subheading} ${rubikFont.className}`}
        >
          5. Data Security
        </h2>
        <p className={styles.paragraph}>
          We take reasonable measures to protect our website and systems.
          However, communication over the internet may not always be completely secure.
        </p>

        <h2 
          className={`${styles.subheading} ${rubikFont.className}`}
        >
          6. Your Rights
        </h2>
        <p className={styles.paragraph}>
          In terms of POPIA, you have the right to access, correct, or request
          deletion of personal information we may hold about you, including
          information contained in email correspondence or published images.
        </p>

        <p className={styles.paragraph}>
          To exercise your rights, please contact us at:
        </p>

        <p className={styles.paragraph}>
          Email:{" "}
          <a href="mailto:thewestvillewarehouse@gmail.com" className={styles.link}>
            thewestvillewarehouse@gmail.com
          </a>
        </p>

        <h2 
          className={`${styles.subheading} ${rubikFont.className}`}
        >
          7. Changes to This Policy
        </h2>
        <p className={styles.paragraph}>
          We may update this Privacy Policy from time to time. The latest
          version will always be available on this page.
        </p>
      </main>
    </>
  );
}