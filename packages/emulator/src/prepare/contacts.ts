import { logger } from "@autonoma/logger";
import type { Contact, DeviceDriver } from "../types";

export async function installContacts(driver: DeviceDriver, contacts: Contact[]): Promise<void> {
    if (contacts.length === 0) return;

    const esc = (s: string) => s.replace(/(["`$\\])/g, "\\$1");

    const scriptLines = [];

    scriptLines.push(
        "set -e",
        "pm clear com.android.providers.contacts >/dev/null 2>&1 || true",
        "sleep 0.5",
        `base=$(content query --uri 'content://com.android.contacts/raw_contacts?limit=1' --projection _id --sort '_id DESC' | sed -n 's/.*_id=\\([0-9]\\+\\).*/\\1/p')`,
        `[ -z "$base" ] && base=0`,
        "n=0",
    );

    for (const c of contacts) {
        // 1) insert a raw_contact
        scriptLines.push(
            `raw_id=$(content insert --uri content://com.android.contacts/raw_contacts --bind account_type:s: --bind account_name:s: | sed -n 's#.*/raw_contacts/\\([0-9]\\+\\).*#\\1#p')`,
            // Fallback if this build doesn't print the URI: compute id locally
            `[ -z "$raw_id" ] && { n=$((n+1)); raw_id=$((base+n)); }`,
        );

        scriptLines.push(
            `content insert --uri content://com.android.contacts/data --bind raw_contact_id:i:$raw_id --bind mimetype:s:vnd.android.cursor.item/name --bind data1:s:"${esc(c.name)}"`,
        );

        scriptLines.push(
            `content insert --uri content://com.android.contacts/data --bind raw_contact_id:i:$raw_id --bind mimetype:s:vnd.android.cursor.item/phone_v2 --bind data2:i:2 --bind data1:s:${esc(c.phone)}`,
        );

        scriptLines.push(
            `content insert --uri content://com.android.contacts/data --bind raw_contact_id:i:$raw_id --bind mimetype:s:vnd.android.cursor.item/email_v2 --bind data2:i:1 --bind data1:s:${esc(c.email)}`,
        );
    }

    const fullScript = scriptLines.join(" && ");
    try {
        await driver.executeScript("mobile: shell", [
            {
                command: "sh",
                args: ["-c", fullScript],
                timeout: 120000,
                includeStderr: true,
            },
        ]);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        logger.fatal(`Error deleting contacts and adding new ones: ${message}`);
    }
}
