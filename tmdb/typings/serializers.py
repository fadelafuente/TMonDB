from rest_framework import serializers

from .models import *
from users.serializers import CreatorSerializer

class BaseListSerializer(serializers.ListSerializer):
    update_lookup_field = 'id'

    class Meta:
        fields = '__all__'
    
    def update(self, instance, validated_data):
        obj_mapping = {obj.id: obj for obj in instance}
        data_mapping = {}
        for item in validated_data:
            if 'id' in item:
                data_mapping[item['id']] = item

        result = []
        for obj_id, data in data_mapping.items():
            obj = obj_mapping.get(obj_id, None)
            if obj is None:
                result.append(self.child.create(data))
            else:
                result.append(self.child.update(obj, data))
            
        for obj_id, obj in obj_mapping.items():
            if obj_id not in data_mapping:
                obj.delete()
                
        return result

class TypeListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = Type
    
    def to_internal_value(self, data):
        result = super().to_internal_value(data)

        id_attr = getattr(self.Meta, 'update_lookup_field', 'id')
        request_method = getattr(getattr(self.context.get('view'), 'request'), 'method', '')

        if all((isinstance(self.root, TypeListSerializer), id_attr, request_method in ('PATCH'))):
            data_dict = {item['name']: item[id_attr] for item in data}

            for item in result:
                if item['name'] in data_dict:
                    item[id_attr] = data_dict[item['name']]

        return result
    
class ModifierListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = TypeModifier
    
    def to_internal_value(self, data):
        result = super().to_internal_value(data)

        id_attr = getattr(self.Meta, 'update_lookup_field', 'id')

        if all((isinstance(self.root, ModifierListSerializer), id_attr)):
            data_dict = {f'{item['attacking_type']} {item['defending_type']}': item[id_attr] for item in data}

            for item in result:
                key = f'{item['attacking_type'].id} {item['defending_type'].id}'
                if key in data_dict:
                    item[id_attr] = data_dict[key]

        return result

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

class TypeUpdateSerializer(TypeSerializer):
    class Meta(TypeSerializer.Meta):
        list_serializer_class = TypeListSerializer

class TypeNameOnlySerializer(TypeSerializer):
    class Meta(TypeSerializer.Meta):
        fields = ['name']

class TypeModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeModifier
        fields = '__all__'

class ModifierUpdateSerializer(TypeModifierSerializer):
    class Meta(TypeModifierSerializer.Meta):
        list_serializer_class = ModifierListSerializer

class DefenseModifiersSerializer(TypeModifierSerializer):
    attacking_type = TypeNameOnlySerializer()

    class Meta(TypeModifierSerializer.Meta):
        fields = ['id', 'attacking_type', 'multiplier']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['attacking_type'] = representation.pop('attacking_type')['name']
        return representation

class TypeWithModifiersSerializer(TypeSerializer):
    defense_modifiers = DefenseModifiersSerializer(many=True)
    creator = CreatorSerializer()
    
class MonsterTypesSerializer(TypeWithModifiersSerializer):
    class Meta(TypeWithModifiersSerializer.Meta):
        fields = ['id', 'name', 'defense_modifiers']