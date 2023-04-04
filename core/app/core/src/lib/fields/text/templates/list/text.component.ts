/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2023 SalesAgility Ltd.
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

import {Component} from '@angular/core';
import {BaseFieldComponent} from '../../../base/base-field.component';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';

@Component({
    selector: 'scrm-text-list',
    templateUrl: './text.component.html',
    styleUrls: []
})
export class TextListFieldComponent extends BaseFieldComponent {

    isTruncated: boolean = false;

    constructor(protected typeFormatter: DataTypeFormatter, protected logic: FieldLogicManager) {
        super(typeFormatter, logic);
    }

    truncateValue(value: string): string[] {
        const chars_limit = 50;
        let truncatedValue = value.slice(0, chars_limit);

        let lines = truncatedValue.split("\n").filter(line => line.trim() !== '');
        lines = lines.filter(item => item != '\r');
        const maxLines = 3;
        const truncatedLines = lines.slice(0, maxLines);

        this.isTruncated = truncatedValue.length !== value.length || lines.length > maxLines;

        return truncatedLines;
    }
}