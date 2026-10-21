/**
 * Static preview mode (NEXT_PUBLIC_STATIC_PREVIEW=1): a server-free export of
 * the landing page for hosted previews. Forms validate in the browser and
 * resolve locally with PREVIEW references; nothing is sent or stored.
 */
export const STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";
