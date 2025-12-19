// src/utils/logger.ts

import { supabaseAdmin } from "../../supabase/supabase.client";


interface LogPayload {
    entity: 'ORDER' | 'USER' | 'PAYMENT';
    entity_id?: string;
    action: string;
    metadata?: Record<string, any>;
    performed_by?: string;
}

export const Logger = {
    /**
     * Write audit log entry
     */
    async log(payload: LogPayload) {
        try {
            await supabaseAdmin
                .from('audit_logs')
                .insert([{
                    entity: payload.entity,
                    entity_id: payload.entity_id,
                    action: payload.action,
                    metadata: payload.metadata ?? null,
                    performed_by: payload.performed_by ?? null,
                }]);
        } catch (error) {
            /**
             * Logging must NEVER break business logic
             * Fail silently but keep console visibility
             */
            console.error('[AUDIT LOG FAILED]', error);
        }
    },
};
