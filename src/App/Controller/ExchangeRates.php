<?php
namespace App\Controller;

use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\JsonResponse;

class ExchangeRates
{
    public function getRates()
    {
        $client = new Client();
        $startDate = new \DateTime('2020-01-01');
        $endDate = new \DateTime();

        $rates = [];

        while ($startDate <= $endDate) {
            if ($startDate->format('N') < 6) { // Exclude Saturday and Sunday
                $date = $startDate->format('Y-m-d');
                try {
                    $response = $client->request('GET', "https://api.nbp.pl/api/exchangerates/tables/A/{$date}/?format=json");
                    $rates[$date] = json_decode($response->getBody(), true);
                } catch (\Exception $e) {
                    // Log the error message
                    error_log($e->getMessage());
                }
            }
            $startDate->modify('+1 day');
        }

        return new JsonResponse($rates);
    }
}