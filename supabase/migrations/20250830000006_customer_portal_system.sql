-- Epic Customer Portal System with Real-time Tracking and Bi-directional Sync
-- This migration creates a comprehensive customer portal with full project visibility

-- Customer Portals table (enhanced)
CREATE TABLE IF NOT EXISTS public.customer_portals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    portal_name VARCHAR(255) NOT NULL,
    portal_slug VARCHAR(255) UNIQUE NOT NULL, -- For custom URLs
    
    -- Access Configuration
    is_active BOOLEAN DEFAULT true,
    access_level VARCHAR(50) DEFAULT 'read_only', -- read_only, interactive, full_access
    features_enabled JSONB DEFAULT '{"dashboard": true, "milestones": true, "tasks": true, "documents": true, "chat": true, "updates": true}'::jsonb,
    
    -- Branding
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#8B5CF6',
    custom_css TEXT,
    welcome_message TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0
);

-- Customer Portal Users (enhanced with roles)
CREATE TABLE IF NOT EXISTS public.customer_portal_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer', -- viewer, contributor, manager, admin
    
    -- Access Control
    can_view_dashboard BOOLEAN DEFAULT true,
    can_view_milestones BOOLEAN DEFAULT true,
    can_update_milestones BOOLEAN DEFAULT false,
    can_view_tasks BOOLEAN DEFAULT true,
    can_update_tasks BOOLEAN DEFAULT false,
    can_view_documents BOOLEAN DEFAULT true,
    can_upload_documents BOOLEAN DEFAULT false,
    can_comment BOOLEAN DEFAULT true,
    can_approve_changes BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT true,
    notification_preferences JSONB DEFAULT '{"milestones": true, "tasks": true, "comments": true, "documents": true}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Portal Dashboard Widgets
CREATE TABLE IF NOT EXISTS public.portal_dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    widget_type VARCHAR(50) NOT NULL, -- progress, timeline, tasks, metrics, alerts, activity
    title VARCHAR(255) NOT NULL,
    position INTEGER DEFAULT 0,
    size VARCHAR(20) DEFAULT 'medium', -- small, medium, large, full
    configuration JSONB,
    is_visible BOOLEAN DEFAULT true,
    refresh_interval INTEGER DEFAULT 60, -- seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Portal Updates (for communication)
CREATE TABLE IF NOT EXISTS public.portal_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id),
    
    -- Update Details
    update_type VARCHAR(50) NOT NULL, -- milestone, task, general, alert, success
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, error, success
    
    -- Metadata
    author_id UUID REFERENCES auth.users(id),
    author_name VARCHAR(255),
    is_pinned BOOLEAN DEFAULT false,
    requires_acknowledgment BOOLEAN DEFAULT false,
    acknowledged_by JSONB DEFAULT '[]'::jsonb,
    
    -- Attachments
    attachments JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Portal Comments
CREATE TABLE IF NOT EXISTS public.portal_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    
    -- Reference
    entity_type VARCHAR(50) NOT NULL, -- milestone, task, document, update
    entity_id UUID NOT NULL,
    
    -- Comment
    user_id UUID REFERENCES auth.users(id),
    user_name VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Threading
    parent_comment_id UUID REFERENCES public.portal_comments(id),
    
    -- Status
    is_internal BOOLEAN DEFAULT false, -- Internal comments not visible to customers
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Portal Approvals
CREATE TABLE IF NOT EXISTS public.portal_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    
    -- Approval Request
    approval_type VARCHAR(50) NOT NULL, -- milestone, change_request, document, deliverable
    entity_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Approval Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, expired
    requested_by UUID REFERENCES auth.users(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Approval Actions
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    rejected_by UUID REFERENCES auth.users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Deadline
    due_date DATE,
    reminder_sent BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Sync Events (for bi-directional sync)
CREATE TABLE IF NOT EXISTS public.sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source and Target
    source_type VARCHAR(50) NOT NULL, -- main_portal, customer_portal
    source_id UUID,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    
    -- Event Details
    event_type VARCHAR(100) NOT NULL, -- create, update, delete
    entity_type VARCHAR(100) NOT NULL, -- project, milestone, task, document, etc.
    entity_id UUID NOT NULL,
    
    -- Sync Data
    change_data JSONB NOT NULL,
    previous_data JSONB,
    
    -- Status
    sync_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    sync_attempts INTEGER DEFAULT 0,
    last_sync_attempt TIMESTAMP WITH TIME ZONE,
    sync_error TEXT,
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE
);

-- Customer Portal Metrics (for tracking)
CREATE TABLE IF NOT EXISTS public.portal_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id),
    
    -- Key Metrics
    metric_date DATE NOT NULL,
    
    -- Progress Metrics
    overall_progress INTEGER DEFAULT 0,
    milestones_completed INTEGER DEFAULT 0,
    milestones_total INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,
    
    -- Time Metrics
    days_elapsed INTEGER DEFAULT 0,
    days_remaining INTEGER DEFAULT 0,
    schedule_variance INTEGER DEFAULT 0, -- positive = ahead, negative = behind
    
    -- Quality Metrics
    issues_open INTEGER DEFAULT 0,
    issues_resolved INTEGER DEFAULT 0,
    approval_pending INTEGER DEFAULT 0,
    customer_satisfaction_score DECIMAL(3,2),
    
    -- Activity Metrics
    updates_posted INTEGER DEFAULT 0,
    comments_made INTEGER DEFAULT 0,
    documents_uploaded INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(portal_id, metric_date)
);

-- Customer Portal Notifications
CREATE TABLE IF NOT EXISTS public.portal_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    
    -- Notification Details
    type VARCHAR(50) NOT NULL, -- milestone_update, task_update, comment, mention, approval_request
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Reference
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    is_email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_portals_project ON public.customer_portals(project_id);
CREATE INDEX IF NOT EXISTS idx_customer_portals_slug ON public.customer_portals(portal_slug);
CREATE INDEX IF NOT EXISTS idx_portal_users_portal ON public.customer_portal_users(portal_id);
CREATE INDEX IF NOT EXISTS idx_portal_users_email ON public.customer_portal_users(email);
CREATE INDEX IF NOT EXISTS idx_portal_widgets_portal ON public.portal_dashboard_widgets(portal_id);
CREATE INDEX IF NOT EXISTS idx_portal_updates_portal ON public.portal_updates(portal_id);
CREATE INDEX IF NOT EXISTS idx_portal_comments_portal ON public.portal_comments(portal_id);
CREATE INDEX IF NOT EXISTS idx_portal_comments_entity ON public.portal_comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_portal_approvals_portal ON public.portal_approvals(portal_id);
CREATE INDEX IF NOT EXISTS idx_portal_approvals_status ON public.portal_approvals(status);
CREATE INDEX IF NOT EXISTS idx_sync_events_status ON public.sync_events(sync_status);
CREATE INDEX IF NOT EXISTS idx_sync_events_entity ON public.sync_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_portal_metrics_portal_date ON public.portal_metrics(portal_id, metric_date);
CREATE INDEX IF NOT EXISTS idx_portal_notifications_user ON public.portal_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_notifications_unread ON public.portal_notifications(user_id, is_read);

-- Enable RLS
ALTER TABLE public.customer_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Customer Portal Access
CREATE POLICY "Portal users can view their portal" ON public.customer_portals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = customer_portals.id
            AND user_id = auth.uid()
            AND is_active = true
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Portal users can view portal users" ON public.customer_portal_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users cpu
            WHERE cpu.portal_id = customer_portal_users.portal_id
            AND cpu.user_id = auth.uid()
            AND cpu.is_active = true
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Portal users can manage widgets" ON public.portal_dashboard_widgets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = portal_dashboard_widgets.portal_id
            AND user_id = auth.uid()
            AND role IN ('manager', 'admin')
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Portal users can view updates" ON public.portal_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = portal_updates.portal_id
            AND user_id = auth.uid()
            AND is_active = true
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Portal users can create comments" ON public.portal_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = portal_comments.portal_id
            AND user_id = auth.uid()
            AND can_comment = true
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Portal users can view comments" ON public.portal_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = portal_comments.portal_id
            AND user_id = auth.uid()
            AND is_active = true
        )
        AND (is_internal = false OR auth.role() = 'service_role')
    );

CREATE POLICY "Portal users can view approvals" ON public.portal_approvals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = portal_approvals.portal_id
            AND user_id = auth.uid()
            AND is_active = true
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Portal users can approve" ON public.portal_approvals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = portal_approvals.portal_id
            AND user_id = auth.uid()
            AND can_approve_changes = true
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Service role manages sync events" ON public.sync_events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Portal users view their metrics" ON public.portal_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customer_portal_users
            WHERE portal_id = portal_metrics.portal_id
            AND user_id = auth.uid()
            AND is_active = true
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Users view their notifications" ON public.portal_notifications
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users update their notifications" ON public.portal_notifications
    FOR UPDATE USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Function for bi-directional sync
CREATE OR REPLACE FUNCTION sync_portal_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log sync event
    INSERT INTO public.sync_events (
        source_type,
        source_id,
        target_type,
        target_id,
        event_type,
        entity_type,
        entity_id,
        change_data,
        previous_data,
        sync_status,
        created_by
    ) VALUES (
        CASE 
            WHEN TG_TABLE_NAME LIKE 'portal_%' THEN 'customer_portal'
            ELSE 'main_portal'
        END,
        CASE 
            WHEN TG_TABLE_NAME LIKE 'portal_%' THEN NEW.portal_id
            ELSE NEW.project_id
        END,
        CASE 
            WHEN TG_TABLE_NAME LIKE 'portal_%' THEN 'main_portal'
            ELSE 'customer_portal'
        END,
        CASE 
            WHEN TG_TABLE_NAME LIKE 'portal_%' THEN 
                (SELECT project_id FROM customer_portals WHERE id = NEW.portal_id)
            ELSE 
                (SELECT id FROM customer_portals WHERE project_id = NEW.project_id)
        END,
        TG_OP,
        TG_TABLE_NAME,
        NEW.id,
        to_jsonb(NEW),
        CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
        'pending',
        auth.uid()
    );
    
    -- Trigger real-time update via Supabase Realtime
    PERFORM pg_notify(
        'portal_sync',
        json_build_object(
            'operation', TG_OP,
            'table', TG_TABLE_NAME,
            'record', NEW
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply sync triggers to key tables
CREATE TRIGGER sync_project_milestones_changes
AFTER INSERT OR UPDATE ON public.project_milestones
FOR EACH ROW
EXECUTE FUNCTION sync_portal_changes();

CREATE TRIGGER sync_project_tasks_changes
AFTER INSERT OR UPDATE ON public.project_tasks
FOR EACH ROW
EXECUTE FUNCTION sync_portal_changes();

CREATE TRIGGER sync_project_documents_changes
AFTER INSERT OR UPDATE ON public.project_documents
FOR EACH ROW
EXECUTE FUNCTION sync_portal_changes();

-- Function to calculate daily metrics
CREATE OR REPLACE FUNCTION calculate_portal_metrics()
RETURNS void AS $$
DECLARE
    portal RECORD;
    project RECORD;
BEGIN
    FOR portal IN SELECT * FROM public.customer_portals WHERE is_active = true
    LOOP
        SELECT * INTO project FROM public.projects WHERE id = portal.project_id;
        
        INSERT INTO public.portal_metrics (
            portal_id,
            project_id,
            metric_date,
            overall_progress,
            milestones_completed,
            milestones_total,
            tasks_completed,
            tasks_total,
            days_elapsed,
            days_remaining,
            schedule_variance,
            issues_open,
            issues_resolved,
            approval_pending,
            updates_posted,
            comments_made,
            documents_uploaded
        ) VALUES (
            portal.id,
            portal.project_id,
            CURRENT_DATE,
            COALESCE(project.completion_percentage, 0),
            (SELECT COUNT(*) FROM project_milestones WHERE project_id = portal.project_id AND status = 'completed'),
            (SELECT COUNT(*) FROM project_milestones WHERE project_id = portal.project_id),
            (SELECT COUNT(*) FROM project_tasks WHERE project_id = portal.project_id AND status = 'completed'),
            (SELECT COUNT(*) FROM project_tasks WHERE project_id = portal.project_id),
            EXTRACT(DAY FROM NOW() - project.created_at)::INTEGER,
            GREATEST(0, EXTRACT(DAY FROM (project.created_at + INTERVAL '6 months') - NOW())::INTEGER),
            0, -- Calculate based on actual vs planned
            (SELECT COUNT(*) FROM project_tasks WHERE project_id = portal.project_id AND status IN ('pending', 'in_progress')),
            (SELECT COUNT(*) FROM project_tasks WHERE project_id = portal.project_id AND status = 'completed'),
            (SELECT COUNT(*) FROM portal_approvals WHERE portal_id = portal.id AND status = 'pending'),
            (SELECT COUNT(*) FROM portal_updates WHERE portal_id = portal.id AND DATE(created_at) = CURRENT_DATE),
            (SELECT COUNT(*) FROM portal_comments WHERE portal_id = portal.id AND DATE(created_at) = CURRENT_DATE),
            (SELECT COUNT(*) FROM project_documents WHERE project_id = portal.project_id AND DATE(created_at) = CURRENT_DATE)
        )
        ON CONFLICT (portal_id, metric_date) 
        DO UPDATE SET
            overall_progress = EXCLUDED.overall_progress,
            milestones_completed = EXCLUDED.milestones_completed,
            milestones_total = EXCLUDED.milestones_total,
            tasks_completed = EXCLUDED.tasks_completed,
            tasks_total = EXCLUDED.tasks_total,
            days_elapsed = EXCLUDED.days_elapsed,
            days_remaining = EXCLUDED.days_remaining,
            issues_open = EXCLUDED.issues_open,
            issues_resolved = EXCLUDED.issues_resolved,
            approval_pending = EXCLUDED.approval_pending,
            updates_posted = EXCLUDED.updates_posted,
            comments_made = EXCLUDED.comments_made,
            documents_uploaded = EXCLUDED.documents_uploaded;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to send notifications
CREATE OR REPLACE FUNCTION send_portal_notification(
    p_portal_id UUID,
    p_user_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_entity_type VARCHAR DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_priority VARCHAR DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.portal_notifications (
        portal_id,
        user_id,
        type,
        title,
        message,
        entity_type,
        entity_id,
        priority
    ) VALUES (
        p_portal_id,
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_entity_type,
        p_entity_id,
        p_priority
    ) RETURNING id INTO notification_id;
    
    -- Trigger real-time notification
    PERFORM pg_notify(
        'portal_notification',
        json_build_object(
            'user_id', p_user_id,
            'notification_id', notification_id,
            'type', p_type,
            'title', p_title
        )::text
    );
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

