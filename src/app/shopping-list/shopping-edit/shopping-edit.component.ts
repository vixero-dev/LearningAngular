import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { flatten } from '@angular/compiler';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('f', { static: false }) slForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItemIndex: number;
    editedItem: Ingredient;

    constructor(private slService: ShoppingListService) {}

    ngOnInit() {
        this.subscription = this.slService.startedEditing.subscribe((index: number) => {
            this.editedItemIndex = index;
            this.editMode = true;
            this.editedItem = this.slService.getIngridinet(index);
            this.slForm.setValue({
                name: this.editedItem.name,
                amount: this.editedItem.amount,
            });
        });
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        const newIngredient = new Ingredient(value.name, value.amount);
        if (this.editMode) {
            this.slService.updateIngridient(this.editedItemIndex, newIngredient);
        } else {
            this.slService.addIngredient(newIngredient);
        }
        this.editMode = false;
        form.reset();
    }

    onDelete(index: number) {
        this.slService.deleteIngridient(this.editedItemIndex);
        this.onClear();
    }

    onClear() {
        this.editMode = false;
        this.slForm.reset();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
