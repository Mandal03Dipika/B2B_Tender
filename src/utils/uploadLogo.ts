import supabase from "./supabase";

export const uploadLogo = async (
  file: Express.Multer.File,
  companyId: string
) => {
  const fileName = `${companyId}-${Date.now()}`;
  const { data, error } = await supabase.storage
    .from("company-logos")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (error) {
    throw error;
  }
  const { data: publicUrl } = supabase.storage
    .from("company-logos")
    .getPublicUrl(fileName);
  return publicUrl.publicUrl;
};
