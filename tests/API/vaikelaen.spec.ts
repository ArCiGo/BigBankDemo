import { test, expect } from '@playwright/test';
import { validateSchemaAjv } from 'playwright-schema-validator';
import { generateCalculatePayload } from './helpers/APIHelpers';
import { happyPathScenarios } from '../data/API/validPayloadRequests';
import { errorPayloadResponse } from '../data/API/errorPayloadResponse';
import * as responseSchema from '../data/API/schemas/responseSchema.json';

test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('Console log:', msg.text()));
});

test.describe('Väikelaen «calculate» API endpoint', () => {
    const endpointURL = '/api/v1/loan/calculate';

    for (const data of happyPathScenarios) {
        test(`POST «calculate»: Should complete successfully ${data.description}`, async ({ page, request }) => {
            let payloadRequest: any, payloadResponse: any, responseBody: any;

            await test.step('STEP 1: Preparing payload request', async () => {
                payloadRequest = generateCalculatePayload(data.amount, data.maturity);
            });

            await test.step('STEP 2: Sending payload request', async () => {
                payloadResponse = await request.post(endpointURL, {
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json, text/plain, */*',
                    },
                    data: payloadRequest,
                });
            });

            await test.step('STEP 3: Validating response status', async () => {
                expect(payloadResponse.status()).toBe(200);
            });

            await test.step('STEP 4: Validating response body', async () => {
                responseBody = await payloadResponse.json();
            
                expect(typeof responseBody.totalRepayableAmount).toBe('number');
                expect(typeof responseBody.monthlyPayment).toBe('number');
                expect(typeof responseBody.apr).toBe('number');
            });

            await test.step('STEP 5: Validating response schema', async () => {
                await validateSchemaAjv(
                    { page },
                    responseBody,
                    responseSchema,
                    { endpoint: endpointURL, method: 'POST', status: 200 }
                );
            });
        });
    }

    test('POST «calculate»: Should return validation error when `conclusionFee` is missing', async ({ request }) => {
        let payloadRequest: any, payloadResponse: any, responseBody: any;

        await test.step('STEP 1: Preparing payload request', async () => {
            payloadRequest = generateCalculatePayload(5000, 60);
            delete payloadRequest.conclusionFee;            
        });

        await test.step('STEP 2: Sending payload request', async () => {
            payloadResponse = await request.post(endpointURL, {
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json, text/plain, */*',
                },
                data: payloadRequest,
            });
        });

        await test.step('STEP 3: Validating response status', async () => {
            expect(payloadResponse.status()).toBe(400);
        });

        await test.step('STEP 4: Validating response body', async () => {
            responseBody = await payloadResponse.json();
            expect(responseBody).toEqual(errorPayloadResponse);
        });
    });
});