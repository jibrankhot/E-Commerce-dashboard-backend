import fs from 'fs';
import { supabaseAdmin } from '../../supabase/supabase.client';

export class StorageService {
    private static bucketName = 'product-images';

    /**
     * Upload multiple images to Supabase Storage (ADMIN)
     * Uses disk-based multer files (file.path)
     */
    static async uploadProductImages(
        files: Express.Multer.File[]
    ): Promise<string[]> {

        if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const fileName = `${Date.now()}-${file.originalname}`;

            // ✅ READ FILE FROM DISK (FIX)
            const fileBuffer = await fs.promises.readFile(file.path);

            const { error } = await supabaseAdmin.storage
                .from(this.bucketName)
                .upload(fileName, fileBuffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (error) {
                throw new Error(`Image upload failed: ${error.message}`);
            }

            const { data } = supabaseAdmin.storage
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
