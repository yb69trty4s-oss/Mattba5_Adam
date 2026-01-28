import ImageKit from "imagekit";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

export const imagekit = publicKey && privateKey && urlEndpoint 
  ? new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    })
  : {
      getAuthenticationParameters: () => {
        throw new Error("ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.");
      },
      upload: () => {
        throw new Error("ImageKit is not configured.");
      }
    } as unknown as ImageKit;
