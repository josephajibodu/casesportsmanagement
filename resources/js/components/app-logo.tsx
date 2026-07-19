import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="h-9 w-auto shrink-0" />
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-xs text-muted-foreground">Admin</span>
            </div>
        </>
    );
}
