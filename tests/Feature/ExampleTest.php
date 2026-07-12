<?php

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertSee('CaSe Sports Management');
    $response->assertSee('coming soon', false);
});
