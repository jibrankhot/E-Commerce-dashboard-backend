import { supabase } from '../supabase/supabase.client';

export class StorageService {
    private static bucketName = 'product-images';

    /**
     * Upload multiple images to Supabase Storage
     */
    static async uploadProductImages(
        files: Express.Multer.File[]
    ): Promise<string[]> {
        if (!supabase) {
            throw new Error('Supabase is not initialized');
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const fileName = `${Date.now()}-${file.originalname}`;

            const { error } = await supabase.storage
                .from(this.bucketName)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                throw new Error(`Image upload failed: ${error.message}`);
            }

            const { data } = supabase.storage
                .from(this.bucketName)
                .getPublicUrl(fileName);

            if (!data?.publicUrl) {
                throw new Error('Failed to generate public image URL');
            }

            uploadedUrls.push(data.publicUrl);
        }

        return uploadedUrls;
    }
}
