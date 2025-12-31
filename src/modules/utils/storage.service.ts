import fs from 'fs';
import { supabaseAdmin } from '../../supabase/supabase.client';

export class StorageService {
    private static bucketName = 'product-images';

    /**
     * Upload multiple images to Supabase Storage (ADMIN)
     * Uses disk-based multer files (file.path)
     * Cleans up local files after upload (success or failure)
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

            try {
                // 1️⃣ Read file from disk
                const fileBuffer = await fs.promises.readFile(file.path);

                // 2️⃣ Upload to Supabase Storage
                const { error } = await supabaseAdmin.storage
                    .from(this.bucketName)
                    .upload(fileName, fileBuffer, {
                        contentType: file.mimetype,
                        upsert: false,
                    });

                if (error) {
                    throw new Error(`Image upload failed: ${error.message}`);
                }

                // 3️⃣ Get public URL
                const { data } = supabaseAdmin.storage
                    .from(this.bucketName)
                    .getPublicUrl(fileName);

                if (!data?.publicUrl) {
                    throw new Error('Failed to generate public image URL');
                }

                uploadedUrls.push(data.publicUrl);
            } finally {
                // 🧹 ALWAYS delete local file (success or failure)
                if (file.path) {
                    await fs.promises.unlink(file.path).catch(() => { });
                }
            }
        }

        return uploadedUrls;
    }

    /**
     * Delete multiple product images from Supabase Storage
     * Accepts public URLs and safely extracts file paths
     * Best-effort: does NOT throw on failure
     */
    static async deleteProductImages(imageUrls: string[]): Promise<void> {
        if (!supabaseAdmin) return;
        if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

        // Example public URL:
        // https://xxxx.supabase.co/storage/v1/object/public/product-images/abc.jpg
        const filePaths = imageUrls
            .map(url => {
                const marker = `/${this.bucketName}/`;
                const index = url.indexOf(marker);
                return index !== -1
                    ? url.substring(index + marker.length)
                    : null;
            })
            .filter(Boolean) as string[];

        if (filePaths.length === 0) return;

        const { error } = await supabaseAdmin.storage
            .from(this.bucketName)
            .remove(filePaths);

        // Never block product deletion because of storage issues
        if (error) {
            console.error(
                'Failed to delete product images from storage:',
                error.message
            );
        }
    }
}
