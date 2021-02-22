/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {Field} from 'common';
import {DynamicLabelModule} from '@components/dynamic-label/dynamic-label.module';
import {UserPreferenceStore} from 'core';
import {userPreferenceStoreMock} from 'core';
import {NumberFormatter} from 'core';
import {numberFormatterMock} from 'core';
import {DatetimeFormatter} from 'core';
import {datetimeFormatterMock} from 'core';
import {DateFormatter} from 'core';
import {dateFormatterMock} from 'core';
import {CurrencyFormatter} from 'core';
import {currencyFormatterMock} from 'core';
import {LanguageStore} from 'core';
import {languageStoreMock} from 'core';

@Component({
    selector: 'dynamic-label-test-host-component',
    template: '<scrm-dynamic-label [template]="template" [fields]="fields" [context]="context"></scrm-dynamic-label>'
})
class DynamicLabelTestHostComponent {
    template = '{{fields.name.label}} {{fields.name.value}} | {{fields.amount.label}}: {{fields.amount.value}} | Min: {{context.min|int}}';
    context = {
        min: '1000',
        module: 'accounts'
    };
    fields = {
        name: {
            value: 'Some Company',
            labelKey: 'LBL_NAME',
            type: 'varchar'
        } as Field,
        amount: {
            value: '1000.50',
            labelKey: 'LBL_AMOUNT',
            type: 'currency',
        } as Field
    };
}


describe('DynamicLabelComponent', () => {
    let testHostComponent: DynamicLabelTestHostComponent;
    let testHostFixture: ComponentFixture<DynamicLabelTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DynamicLabelTestHostComponent,
            ],
            imports: [
                DynamicLabelModule
            ],
            providers: [
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {provide: CurrencyFormatter, useValue: currencyFormatterMock},
                {provide: LanguageStore, useValue: languageStoreMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(DynamicLabelTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should render', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have label', () => {

        expect(testHostComponent).toBeTruthy();

        const element = testHostFixture.nativeElement.getElementsByClassName('dynamic-label').item(0);
        const expected = 'Name: Some Company | Amount: $1,000.50 | Min: 1,000';

        expect(element).toBeTruthy();
        expect(element.textContent).toContain(expected);
    });
});