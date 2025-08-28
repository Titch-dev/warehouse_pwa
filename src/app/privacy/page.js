import Head from "next/head";
import styles from "./privacy-policy.module.css";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | The Westville Warehouse</title>
      </Head>
      <main className={styles.container}>
        <h1 className={styles.heading}>Privacy Policy</h1>

        <p className={styles.paragraph}>
          <strong>Effective Date:</strong> July 28, 2025
        </p>

        <p className={styles.paragraph}>
          The Westville Warehouse ("we", "our", or "us") is committed to protecting
          your privacy and ensuring that your personal information is collected
          and used properly, lawfully, and transparently in accordance with the
          Protection of Personal Information Act (POPIA).
        </p>

        <h2 className={styles.subheading}>1. Information We Collect</h2>
        <p className={styles.paragraph}>
          We collect and process the following personal information when you
          submit an enquiry via our contact form:
        </p>
        <ul className={styles.list}>
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your enquiry message</li>
        </ul>

        <h2 className={styles.subheading}>2. How We Use Your Information</h2>
        <p className={styles.paragraph}>
          Your personal information is used solely for the purpose of responding
          to your enquiry.
        </p>

        <h2 className={styles.subheading}>3. Data Security</h2>
        <p className={styles.paragraph}>
          We take reasonable precautions to protect your personal data, but
          please be aware that data transmission over the internet may not be
          100% secure.
        </p>

        <h2 className={styles.subheading}>4. Your Rights</h2>
        <p className={styles.paragraph}>
          You have the right to access, correct, or delete your personal
          information. To exercise these rights, please contact us at:
        </p>
        <p className={styles.paragraph}>
          Email:{" "}
          <a href="mailto:thewestvillewarehouse@gmail.com" className={styles.link}>
            thewestvillewarehouse@gmail.com
          </a>
        </p>

        <h2 className={styles.subheading}>5. Retention of Data</h2>
        <p className={styles.paragraph}>
          We retain your data only as long as needed to address your enquiry or
          meet legal requirements.
        </p>

        <h2 className={styles.subheading}>6. Changes to This Policy</h2>
        <p className={styles.paragraph}>
          We may update this policy from time to time. The most recent version
          will always be available on this page.
        </p>
      </main>
    </>
  );
}
