import { ChefHat } from "lucide-react";

export default function RecipeGrid({meals}) {
    if(!meals.length){
        return(
            <div className="">
                <ChefHat size={48} className="" />
                <p className="">No recipes yet</p>
                <p className="">Select a mood or search for a recipe to get started</p>
            </div>
        )
    }
}