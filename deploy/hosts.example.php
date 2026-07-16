<?php

declare(strict_types=1);

namespace Deployer;

host('production')
    ->setHostname('your-server.com')
    ->set('remote_user', 'deployer')
    // ->set('identity_file', '~/.ssh/id_rsa')
    // ->set('port', '22')
    ->set('deploy_path', '/var/www/casesportsmanagement')
    ->set('branch', 'main')
    // Web server user — required when Deployer can't auto-detect it (common on shared/cPanel hosting).
    // VPS: usually www-data (Debian/Ubuntu) or nginx (CentOS). cPanel: usually same as remote_user.
    ->set('http_user', 'www-data');

// Shared hosting (no sudo / no setfacl): use chmod instead of ACL.
// ->set('writable_mode', 'chmod')
// ->set('writable_chmod_mode', '0775');

// Optional: staging environment
// host('staging')
//     ->setHostname('staging.your-server.com')
//     ->set('remote_user', 'deployer')
//     ->set('deploy_path', '/var/www/casesportsmanagement-staging')
//     ->set('branch', 'main');
