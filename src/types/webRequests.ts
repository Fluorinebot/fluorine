// https://api.mojang.com/users/profiles/minecraft/{name}
export interface UUIDResponse {
    name: string;
    id: string;
}

// https://api-shipx-pl.easypack24.net/v1/statuses?lang=en
export interface InpostStatuses {
    href: string;
    items: InpostStatusItem[];
}

interface InpostStatusItem {
    name: string;
    title: string;
    description: string;
}

export interface InpostTrackObj {
    custom_attributes: {
        target_machine_detail: {
            name: string;
            location_description: string;
            opening_hours: string;
        };
    };
    tracking_details: InpostTrackStatus[];
}

interface InpostTrackStatus {
    status: string;
}
