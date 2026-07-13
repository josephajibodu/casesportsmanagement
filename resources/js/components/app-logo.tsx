import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="size-9 shrink-0" />
            <div className="ml-1 grid flex-1 text-left">
                <span className="mb-0.5 truncate font-semibold leading-tight">
                    CaSe <span className="text-primary">Sports</span>
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Admin
                </span>
            </div>
        </>
    );
}
