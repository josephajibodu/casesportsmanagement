<?php

declare(strict_types=1);

namespace Deployer;

require 'recipe/laravel.php';

// Project
set('application', 'casesportsmanagement');
set('repository', 'git@github.com:josephajibodu/casesportsmanagement.git');
set('keep_releases', 5);

// Shared files and directories persist across releases.
set('shared_dirs', ['storage']);
set('shared_files', ['.env']);
set('writable_dirs', [
    'bootstrap/cache',
    'storage',
]);

// Build frontend assets on the server (public/build and public/build-static are not in git).
desc('Install npm dependencies and build frontend assets');
task('deploy:npm', function (): void {
    cd('{{release_path}}');
    run('npm ci');
    run('npm run build');
    run('npm run build:static');
});

after('deploy:vendors', 'deploy:npm');
after('deploy:publish', 'artisan:queue:restart');
after('deploy:failed', 'deploy:unlock');

// Host definitions — copy deploy/hosts.example.php to deploy/hosts.php and customize.
if (file_exists(__DIR__.'/deploy/hosts.php')) {
    require __DIR__.'/deploy/hosts.php';
}
