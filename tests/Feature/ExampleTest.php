<?php

test('the homepage returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertSee('CaSe Sports Management');
    $response->assertSee('Personal approach');
});

test('the coming soon page is still reachable', function () {
    $this->get(route('coming-soon'))
        ->assertOk()
        ->assertSee('coming soon', false);
});
