<?php

namespace Database\Seeders;

use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\Partner;
use App\Models\SiteSetting;
use App\Models\Talent;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SiteContentSeeder extends Seeder
{
    /**
     * Seed curated placeholder content for the public site.
     */
    public function run(): void
    {
        $this->seedSettings();
        $talents = $this->seedTalents();
        $this->seedTeam();
        $this->seedPartners();
        $this->seedNews();
        $this->seedGallery($talents);
    }

    protected function img(string $seed, int $w = 900, int $h = 1100): string
    {
        return "https://picsum.photos/seed/{$seed}/{$w}/{$h}";
    }

    protected function seedSettings(): void
    {
        SiteSetting::query()->delete();

        SiteSetting::create([
            'agency_name' => 'CaSe Sports Management',
            'tagline' => 'FIFA-licensed representation for players, clubs and national football associations.',
            'agency_story' => 'CaSe Sports Management is a sports management company. We are a team of FIFA licensed '
                .'agents, former sporting directors with years of experience in football management. We provide '
                .'professional solutions for players, football teams and national football associations. One of our '
                ."key areas of operations is in organizing preparatory trainings for football academy across Africa.\n\n"
                ."CaSe Sports Management has also advised some of the World's largest Clubs, Sponsors and Brands in "
                .'relation to player placement and sponsorship and marketing Projects.',
            'mission' => 'To provide professional solutions for players, clubs and national associations, building '
                .'lasting careers through trusted relationships, strategic guidance and dedicated day-to-day support.',
            'vision' => 'To be the representation partner of choice across Africa and the global game, known for '
                .'integrity, reach, and a genuine player-first philosophy.',
            'fifa_license_info' => 'FIFA Licensed Football Agent, Licence N° FIFA: 202606-12910',
            'services' => [
                ['group' => '', 'title' => 'Contract Negotiation', 'description' => 'Securing the best possible terms with clubs, coaches and federations.'],
                ['group' => '', 'title' => 'Marketing', 'description' => 'Building your profile and reach through targeted marketing.'],
                ['group' => '', 'title' => 'Endorsements', 'description' => 'Connecting players with the right commercial and endorsement deals.'],
                ['group' => '', 'title' => 'Financial Advice', 'description' => 'Guidance on managing and growing your finances throughout your career.'],
                ['group' => '', 'title' => 'Image Rights', 'description' => 'Protecting and managing your image rights and commercial identity.'],
                ['group' => '', 'title' => 'Career Strategy', 'description' => 'Long-term planning to guide every step of your career.'],
                ['group' => '', 'title' => 'Mortgages', 'description' => 'Support with mortgages and property decisions at home and abroad.'],
                ['group' => '', 'title' => 'Personal Holiday Service Worldwide', 'description' => 'Bespoke travel and holiday planning anywhere in the world.'],
                ['group' => '', 'title' => 'Club Network', 'description' => 'Access to an extensive network of clubs, scouts and associations.'],
                ['group' => '', 'title' => 'Lifestyle Management', 'description' => 'Day-to-day lifestyle support so you can focus on football.'],
                ['group' => '', 'title' => 'Media Training', 'description' => 'Preparing players to handle media and public appearances with confidence.'],
            ],
            'stats' => [
                ['value' => '20+', 'label' => 'Players Represented'],
                ['value' => '8+', 'label' => 'Countries Active'],
                ['value' => 'FIFA', 'label' => 'Licensed Agent'],
                ['value' => '∞', 'label' => 'Long-Term Focus'],
            ],
            'email' => 'info@casesportsmanagement.com',
            'phone' => '+44 20 1234 5678',
            'address_line1' => 'Mile 2',
            'city' => 'Limbe',
            'province' => 'Fako, South West Region',
            'country' => 'Cameroon',
            'social_links' => [
                'instagram' => 'https://instagram.com/casesportsmanagement',
                'twitter' => 'https://x.com/casesports',
                'facebook' => 'https://facebook.com/casesportsmanagement',
                'linkedin' => 'https://linkedin.com/company/casesportsmanagement',
            ],
        ]);
    }

    /**
     * @return array<int, Talent>
     */
    protected function seedTalents(): array
    {
        Talent::query()->delete();

        $roster = [
            [
                'type' => 'player', 'full_name' => 'Marcus Adeyemi', 'position' => 'LW / AM',
                'nationality' => 'England', 'secondary_nationality' => 'Nigeria', 'current_club' => 'Riverside United',
                'is_featured' => true, 'seed' => 'adeyemi',
                'shirt' => 11, 'secondary_positions' => ['RW', 'ST'], 'dob' => '2004-03-18', 'place_of_birth' => 'London, England',
                'height' => 180, 'weight' => 74, 'foot' => 'right', 'contract_status' => 'contracted',
                'contract_until' => '2028-06-30', 'market_value' => '€4.5M',
                'biography' => 'A dynamic attacking talent with an eye for the decisive moment, Marcus combines pace, '
                    .'close control, and a maturity beyond his years. Comfortable operating off either flank or through '
                    .'the middle, he has established himself as one of the most exciting prospects in the division.',
                'career' => [['club' => 'Riverside Academy', 'years' => '2019–2022'], ['club' => 'Riverside United', 'years' => '2022–Present']],
            ],
            [
                'type' => 'player', 'full_name' => 'Diego Fontana', 'position' => 'CB',
                'nationality' => 'Italy', 'current_club' => 'AC Meridian', 'is_featured' => true, 'seed' => 'fontana',
                'shirt' => 4, 'secondary_positions' => ['RB'], 'dob' => '2003-11-02', 'place_of_birth' => 'Turin, Italy',
                'height' => 189, 'weight' => 82, 'foot' => 'right', 'contract_status' => 'contracted',
                'contract_until' => '2027-06-30', 'market_value' => '€6M',
                'biography' => 'A commanding central defender who reads the game superbly, Diego brings composure, '
                    .'aerial dominance, and a calm presence in possession. His leadership on the pitch belies his age '
                    .'and marks him out as a future captain.',
                'career' => [['club' => 'Meridian Primavera', 'years' => '2018–2021'], ['club' => 'AC Meridian', 'years' => '2021–Present']],
            ],
            [
                'type' => 'coach', 'full_name' => 'Thomas Beckenbauer', 'position' => 'Head Coach',
                'nationality' => 'Germany', 'current_club' => 'FC Nordstern', 'is_featured' => true, 'seed' => 'beckenbauer',
                'biography' => 'A modern, possession-oriented coach with a decade of experience developing young talent, '
                    .'Thomas is known for building cohesive, tactically flexible sides. His work on the training ground '
                    .'and in the transfer market has earned respect across the European game.',
                'career' => [['club' => 'Nordstern U19', 'years' => '2014–2019'], ['club' => 'FC Nordstern', 'years' => '2019–Present']],
            ],
            [
                'type' => 'player', 'full_name' => 'Amadou Diallo', 'position' => 'ST',
                'nationality' => 'Senegal', 'current_club' => 'Coastal City', 'is_featured' => false, 'seed' => 'diallo',
                'biography' => 'A powerful, clinical striker with an instinct for goal, Amadou leads the line with '
                    .'relentless energy and a growing tactical intelligence.',
                'career' => [['club' => 'Dakar Sporting', 'years' => '2020–2023'], ['club' => 'Coastal City', 'years' => '2023–Present']],
            ],
            [
                'type' => 'player', 'full_name' => 'Lucas Moreira', 'position' => 'CM',
                'nationality' => 'Brazil', 'current_club' => 'Atlético Verde', 'is_featured' => false, 'seed' => 'moreira',
                'biography' => 'A creative midfield metronome, Lucas dictates tempo, threads incisive passes, and works '
                    .'tirelessly to link defence and attack.',
                'career' => [['club' => 'Verde Youth', 'years' => '2019–2022'], ['club' => 'Atlético Verde', 'years' => '2022–Present']],
            ],
            [
                'type' => 'player', 'full_name' => 'Noah Petersen', 'position' => 'GK',
                'nationality' => 'Denmark', 'current_club' => 'Havn BK', 'is_featured' => false, 'seed' => 'petersen',
                'biography' => 'A commanding goalkeeper with quick reflexes and excellent distribution, Noah has become '
                    .'a dependable last line for club and country at youth level.',
                'career' => [['club' => 'Havn Academy', 'years' => '2018–2021'], ['club' => 'Havn BK', 'years' => '2021–Present']],
            ],
            [
                'type' => 'player', 'full_name' => 'Kai Nakamura', 'position' => 'RB',
                'nationality' => 'Japan', 'current_club' => 'Tokyo Azure', 'is_featured' => false, 'seed' => 'nakamura',
                'biography' => 'An energetic, overlapping full-back, Kai offers width, stamina, and a dangerous delivery '
                    .'from the right flank.',
                'career' => [['club' => 'Azure Youth', 'years' => '2019–2022'], ['club' => 'Tokyo Azure', 'years' => '2022–Present']],
            ],
            [
                'type' => 'coach', 'full_name' => 'Sofia Marchetti', 'position' => 'Goalkeeping Coach',
                'nationality' => 'Italy', 'current_club' => 'AC Meridian', 'is_featured' => false, 'seed' => 'marchetti',
                'biography' => 'A specialist goalkeeping coach with a background in sports science, Sofia is renowned for '
                    .'developing technically complete, modern goalkeepers.',
                'career' => [['club' => 'Meridian Academy', 'years' => '2016–2020'], ['club' => 'AC Meridian', 'years' => '2020–Present']],
            ],
        ];

        $models = [];
        foreach ($roster as $i => $r) {
            $isPlayer = $r['type'] === 'player';

            $models[] = Talent::create([
                'type' => $r['type'],
                'full_name' => $r['full_name'],
                'slug' => Str::slug($r['full_name']),
                'photo' => $this->img($r['seed']),
                'position' => $r['position'],
                'shirt_number' => $isPlayer ? ($r['shirt'] ?? (($i * 7) % 28) + 2) : null,
                'secondary_positions' => $r['secondary_positions'] ?? [],
                'nationality' => $r['nationality'],
                'secondary_nationality' => $r['second_nationality'] ?? null,
                'date_of_birth' => $isPlayer
                    ? ($r['dob'] ?? now()->subYears(18 + ($i % 9))->subDays(($i * 37) % 300)->format('Y-m-d'))
                    : null,
                'place_of_birth' => $r['place_of_birth'] ?? null,
                'height_cm' => $isPlayer ? ($r['height'] ?? 172 + (($i * 5) % 22)) : null,
                'weight_kg' => $isPlayer ? ($r['weight'] ?? 66 + (($i * 3) % 16)) : null,
                'preferred_foot' => $isPlayer ? ($r['foot'] ?? ($i % 4 === 0 ? 'left' : 'right')) : null,
                'current_club' => $r['current_club'],
                'contract_status' => $isPlayer ? ($r['contract_status'] ?? 'contracted') : null,
                'contract_until' => $isPlayer
                    ? ($r['contract_until'] ?? now()->addYears(2 + ($i % 3))->format('Y-m-d'))
                    : null,
                'market_value' => $r['market_value'] ?? null,
                'biography' => $r['biography'],
                'career_history' => $r['career'],
                'video_links' => [
                    ['label' => 'Highlight Reel', 'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
                ],
                'gallery_images' => [
                    $this->img($r['seed'].'-a', 1200, 800),
                    $this->img($r['seed'].'-b', 1200, 800),
                ],
                'is_featured' => $r['is_featured'],
                'status' => 'published',
                'sort_order' => $i,
            ]);
        }

        return $models;
    }

    protected function seedTeam(): void
    {
        TeamMember::query()->delete();

        $members = [
            ['full_name' => 'Che Claud Tamanji', 'title' => 'Lead FIFA Agent', 'photo' => 'che-claud-tamanji.jpg',
                'bio' => 'Che Claud Tamanji is a licensed FIFA Agent and the Lead FIFA Agent at CaSe Sports Management, '
                    .'dedicated to identifying, developing, and representing football talent with professionalism, '
                    ."integrity, and a long-term vision for success.\n\n"
                    .'With a strong understanding of the modern football landscape and the global transfer market, Che '
                    .'works closely with players at different stages of their careers, providing strategic guidance both '
                    .'on and off the pitch. His approach combines athlete representation, career planning, contract '
                    .'negotiation, transfer management, and personal development to help players maximise their potential '
                    ."and build sustainable careers.\n\n"
                    .'At CaSe Sports Management, Che leads with a player-first philosophy, focused on creating '
                    ."opportunities that align with each athlete's sporting ambitions, personal values, and long-term "
                    .'goals. He believes that successful representation goes beyond securing contracts. It means building '
                    .'trusted relationships, opening the right doors, and supporting players throughout every stage of '
                    ."their journey.\n\n"
                    .'Driven by excellence and committed to delivering results, Che continues to build pathways for '
                    .'football talent while maintaining the highest professional standards in the game.'],
            ['full_name' => 'Mahmoud Bin Saed', 'title' => 'Chief Administrative Officer', 'photo' => 'mahmoud-bin-saed.jpg',
                'bio' => 'Mahmoud Bin Saed, Cameroonian born, is the Chief Administrative Officer of CaSe Sports '
                    ."Management.\n\n"
                    ."He is an international players intermediary and has over 15 years' of experience in the business of "
                    .'negotiating contracts with players and coaches as well as between clubs and national football '
                    ."squads.\n\n"
                    .'He is also a specialist in organizing local, national and international matches, friendlies between '
                    .'football federations across the globe, with a regulation as match agent.'],
            ['full_name' => 'Boban Ivanovic', 'title' => 'Director of Football', 'photo' => 'boban-ivanovic.jpg',
                'bio' => 'Boban Ivanovic is a Serbian former footballer, Director of football for CaSe Sports '
                    .'Management. He has vast experience in overseeing the administrative, logistical, and day-to-day '
                    ."management of football programs, scouting, tournaments and player welfare. As a former player he's "
                    .'well connected on and off the pitch.'],
        ];

        foreach ($members as $i => $m) {
            TeamMember::create([
                'full_name' => $m['full_name'],
                'title' => $m['title'],
                'photo' => $this->storeTeamPhoto($m['photo']),
                'bio' => $m['bio'],
                'sort_order' => $i,
            ]);
        }
    }

    /**
     * Copy a bundled team photo onto the public disk and return its stored path.
     */
    protected function storeTeamPhoto(string $file): ?string
    {
        $source = database_path("seeders/assets/team/{$file}");

        if (! is_file($source)) {
            return null;
        }

        Storage::disk(config('media.disk'))->putFileAs('team', new File($source), $file);

        return "team/{$file}";
    }

    protected function seedPartners(): void
    {
        Partner::query()->delete();

        $names = ['Apex Sportswear', 'Meridian Bank', 'Continental Nutrition', 'Vanta Legal', 'Northgate Media', 'Prime Performance'];
        foreach ($names as $i => $name) {
            Partner::create([
                'name' => $name,
                'logo' => null,
                'description' => 'Trusted partner supporting our players and the agency.',
                'sort_order' => $i,
            ]);
        }
    }

    protected function seedNews(): void
    {
        NewsArticle::query()->delete();

        $articles = [
            ['title' => 'Marcus Adeyemi Signs New Long-Term Deal at Riverside United', 'category' => 'Player Updates', 'seed' => 'news1',
                'excerpt' => 'The exciting winger has committed his future to the club with a new contract running through 2028.'],
            ['title' => 'CaSe Sports Management Expands Into the Scandinavian Market', 'category' => 'Agency Announcements', 'seed' => 'news2',
                'excerpt' => 'The agency announces new representation across Denmark, Sweden, and Norway as part of its continued growth.'],
            ['title' => 'Diego Fontana Called Up to National Youth Squad', 'category' => 'Player Updates', 'seed' => 'news3',
                'excerpt' => 'Our commanding centre-back earns a well-deserved international call-up after a standout season.'],
            ['title' => 'Feature: How Modern Data Is Reshaping Player Development', 'category' => 'Football Updates', 'seed' => 'news4',
                'excerpt' => 'A look at the analytical tools shaping how clubs and agencies develop the next generation of talent.'],
            ['title' => 'CaSe Sports Management Featured in Leading Football Business Journal', 'category' => 'Press Mentions', 'seed' => 'news5',
                'excerpt' => 'The agency\'s player-first philosophy is profiled in a widely-read industry publication.'],
            ['title' => 'Thomas Beckenbauer Guides FC Nordstern to Cup Semi-Final', 'category' => 'Player Updates', 'seed' => 'news6',
                'excerpt' => 'A superb tactical performance sees our head coach lead his side deep into the domestic cup.'],
        ];

        foreach ($articles as $i => $a) {
            NewsArticle::create([
                'title' => $a['title'],
                'slug' => Str::slug($a['title']),
                'excerpt' => $a['excerpt'],
                'body' => $this->newsBody($a['excerpt']),
                'featured_image' => $this->img($a['seed'], 1200, 800),
                'category' => $a['category'],
                'published_at' => now()->subDays(($i + 1) * 6),
                'status' => 'published',
            ]);
        }
    }

    protected function newsBody(string $lead): string
    {
        return "<p>{$lead}</p>"
            .'<p>CaSe Sports Management continues to work closely with our clients and their clubs to secure '
            .'the best possible outcomes both on and off the pitch. This latest development reflects the trust '
            .'and long-term relationships at the heart of everything we do.</p>'
            .'<p>We remain committed to providing dedicated, personal support at every stage of our players\' and '
            .'coaches\' careers, and we look forward to sharing more news in the weeks ahead.</p>';
    }

    /**
     * @param  array<int, Talent>  $talents
     */
    protected function seedGallery(array $talents): void
    {
        MediaItem::query()->delete();

        $images = [
            ['Events', 'End-of-season awards evening'],
            ['Matches', 'Matchday under the lights'],
            ['Agency Activities', 'Contract signing at the office'],
            ['Player Moments', 'Celebrating a decisive goal'],
            ['Matches', 'Pre-match warm-up'],
            ['Events', 'Community coaching session'],
            ['Player Moments', 'Training ground focus'],
            ['Agency Activities', 'Meeting with club officials'],
        ];

        foreach ($images as $i => [$category, $caption]) {
            MediaItem::create([
                'media_type' => 'image',
                'category' => $category,
                'image_path' => $this->img('gallery-'.$i, 1200, 900),
                'caption' => $caption,
                'talent_id' => $talents[$i % count($talents)]->id ?? null,
                'sort_order' => $i,
            ]);
        }

        $videos = [
            ['Highlights', 'Season highlight reel', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            ['Interviews', 'In conversation with our latest signing', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            ['Media Appearances', 'Agency feature on matchday coverage', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            ['Highlights', 'Best goals of the month', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
        ];

        foreach ($videos as $i => [$category, $caption, $url]) {
            MediaItem::create([
                'media_type' => 'video',
                'category' => $category,
                'video_url' => $url,
                'caption' => $caption,
                'talent_id' => $talents[$i % count($talents)]->id ?? null,
                'sort_order' => $i,
            ]);
        }
    }
}
