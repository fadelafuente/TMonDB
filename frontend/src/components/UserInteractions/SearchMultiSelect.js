import React, { useEffect, useState } from "react";
import Select from 'react-select';

export default function SearchMultiSelect({ initialItems, groups=null, chosenItems, setChosenItems, limit=null, isGrouped=false, isMulti=false }) {
    const [groupedItems, setGroupedItems] = useState(
        groups instanceof Array ? 
            Object.keys(initialItems).map((key, _) => {
                const currentGroup = initialItems[key].map(type => MakeOption(type, key));
                return {label: key, options: currentGroup};
            })
        :
            initialItems.map(type => MakeOption(type))
    ); 

    useEffect(() => {
        if(groups instanceof Array && groups) { 
            const allOptions = [];

            groups.forEach((option) => {
                const group = option["value"];
                if(group in initialItems) {
                    const groupOptions = initialItems[group].map(type => MakeOption(type, group));
                    allOptions.push({label: group, options: groupOptions});
                }
            });

            setGroupedItems(allOptions);
        } else if(groups instanceof Array && initialItems instanceof Array) {
            setGroupedItems(
                Object.keys(initialItems).map((key, _) => {
                    const currentGroup = initialItems[key].map(type => MakeOption(type, key));
                    return {label: key, options: currentGroup};
                })
            );
        }
    }, [groups, initialItems]);

    function MakeOption(t, g=null) {
        const option = {value: t, label: t};

        if(g) {
            option["groupName"] = g;
        }

        return option;
    }

    function onItemsChange(e) {
        setChosenItems(e);
    }

    return (
        <div className="row-to-col-container">
            <Select
                className="multiselect-container"
                classNamePrefix="multiselect"
                isMulti={ isMulti } 
                closeMenuOnSelect={ !isMulti }
                options={ groupedItems } 
                onChange={ e => onItemsChange(e) }
                isOptionDisabled={ () => limit && chosenItems ? chosenItems.length >= limit : false }
                value={ chosenItems }
            />
        </div>
    );
}