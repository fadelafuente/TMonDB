from django.db import transaction
import re
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from abilities.serializers import MinimumAbilitySerializer
from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer, BaseListSerializer
from .models import *
from moves.serializers import MonsterMoveSerializer
from typings.serializers import MonsterTypesSerializer

'''
    Evolution serializers
        - EvolutionListSerializer:
            Used for bulk creating and bulk updating the Evolution through table.
        - EvolutionSerializer:
            Base Evolution serializer.
        - RetrieveEvolutionSerializer:
            Used to obtain information not obtainable through normal means such
            as the method of how a monster evolves.
'''
class EvolutionListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = Evolution

    def to_internal_value(self, data):
        return super(BaseListSerializer, self).to_internal_value(data)
    
    def get_mappings(self, instance, validated_data):
        obj_mapping = {f'{obj.from_monster}&{obj.to_monster}': obj for obj in instance}
        data_mapping = {}
        for item in validated_data:
            if 'from_monster' in item and 'to_monster' in item:
                data_mapping[f'{item['from_monster']}&{item['to_monster']}'] = item

        return obj_mapping, data_mapping

class EvolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evolution
        fields = '__all__'
        list_serializer_class = EvolutionListSerializer

    def validate(self, attrs):
        to_monster = attrs.get('to_monster', None)
        from_monster = attrs.get('from_monster', None)
        if to_monster and from_monster:
            if to_monster == from_monster:
                raise serializers.ValidationError('A monster cannot evolve into itself.')
            
            existing_evolution = Evolution.objects.filter(to_monster=from_monster, from_monster=to_monster)
            if existing_evolution.exists():
                raise serializers.ValidationError('A monster cannot evolve back into a pre-evolution.')
        
        return super().validate(attrs)
    
    def validate_to_monster(self, to_monster):
        request = self.context.get('request', None)
        if request and request.user != to_monster.article.creator:
            raise PermissionDenied('Can only use a monster created by the user in evolution.')

        return to_monster
    
    def validate_from_monster(self, from_monster):
        return self.validate_to_monster(from_monster)

class RetrieveEvolutionSerializer(EvolutionSerializer):
    class Meta(EvolutionSerializer.Meta):
        fields = ['method']

'''
    MoveSet serializers
        - MoveSetListSerializer:
            Used for bulk creating and bulk updating the MoveSet through table.
        - MoveSetSerializer:
            Base MoveSet serializer.
        - RetrieveMovesetSerializer:
            Used to obtain information not obtainable through normal means such
            as the method a monster learns a move.
'''  
class MoveSetListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = MoveSet

    def to_internal_value(self, data):
        return super(BaseListSerializer, self).to_internal_value(data)
    
    def get_mappings(self, instance, validated_data):
        obj_mapping = {f'{obj.monster}&{obj.move}': obj for obj in instance}
        data_mapping = {}
        for item in validated_data:
            if 'monster' in item and 'move' in item:
                data_mapping[f'{item['monster']}&{item['move']}'] = item

        return obj_mapping, data_mapping
    
class MoveSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoveSet
        fields = '__all__'
        list_serializer_class = MoveSetListSerializer

    def validate_monster(self, monster):
        request = self.context.get('request', None)
        if request and request.user != monster.article.creator:
            raise PermissionDenied('Can only use a monster created by the user in evolution.')

        return monster
    
    def validate_move(self, move):
        request = self.context.get('request', None)
        if request and request.user != move.article.creator:
            raise PermissionDenied('Can only use a move created by the user in evolution.')

        return move
    
class RetrieveMovesetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoveSet
        fields = ['method']

class MonsterMovesetSerializer(MonsterMoveSerializer):
    def serialize_moveset(self, move_instance):
        if 'monster_instance' in self.context:
            moveset_instance = MoveSet.objects.filter(monster_id=self.context['monster_instance'].id, move_id=move_instance.id).first()

            if moveset_instance:
                return RetrieveMovesetSerializer(moveset_instance).data
        return {}
    
    def to_representation(self, instance):
        result = super().to_representation(instance)
        return {**result, **self.serialize_moveset(instance)}   

'''
    Monster Serializers
        - MonsterSerializer:
            Base Monster serializer.
        - MinimumMonsterSerializer:
            Used to obtain the least amount of information needed, such
            as listing for evolution/pre-evolution lists.
        - RetrieveMonsterSerializer:
            Used to obtain all the information needed for any particular
            monster page.
        - MonsterScrollSerializer:
            Used to obtain all the information needed if monsters were
            listed as posts.
'''
class MonsterSerializer(ModelWithArticleSerializer):
    model = Monster

    class Meta:
        model = Monster
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        abilities_data = validated_data.pop('abilities', None)
        types_data = validated_data.pop('types', None)

        instance = super().create(validated_data)
        
        if abilities_data:
            instance.abilities.set(abilities_data)
        if types_data:
            instance.types.set(types_data)
        
        return instance
    
    def serialize_evolution(self, monster_instance):
        if 'from_monster_instance' in self.context:
            evolution_instance = monster_instance.to_monster.filter(from_monster=self.context['from_monster_instance']).first()

            if evolution_instance:
                return RetrieveEvolutionSerializer(evolution_instance).data
        return {}
    
    def serialize_pre_evolution(self, monster_instance):
        if 'to_monster_instance' in self.context:
            pre_evolution_instance = monster_instance.from_monster.filter(to_monster=self.context['to_monster_instance']).first()

            if pre_evolution_instance:
                return RetrieveEvolutionSerializer(pre_evolution_instance).data
        return {}
    
    def get_evolutions(self, monster):
        return MinimumMonsterSerializer(monster.evolutions.all(), many=True, context={'from_monster_instance': monster}).data
    
    def get_pre_evolutions(self, monster):
        return MinimumMonsterSerializer(monster.pre_evolutions.all(), many=True, context={'to_monster_instance': monster}).data
    
    def get_moveset(self, monster):
        return MonsterMovesetSerializer(monster.moveset.all(), many=True, context={'monster_instance': monster}).data

    def to_representation(self, instance):
        result = super().to_representation(instance)
        return {**result, **self.serialize_evolution(instance), **self.serialize_pre_evolution(instance)}

    def validate_name(self, name):
        regex = re.compile(r'^[a-zA-Z0-9À-ÖØ-öø-ÿ\'-]+$')
        name = name[0].upper() + name[1:]
        if regex.match(name) == None:
                raise serializers.ValidationError('Monster name is invalid.')
        return name
    
    def validate_abilities(self, abilities):
        if len(abilities) > 5:
                raise serializers.ValidationError('Monsters can only have 5 abilities.')
        return abilities
    
    def validate_types(self, types):
        if len(types) > 2:
            raise serializers.ValidationError('Monsters can only have 2 types.')
        return types
    
class MinimumMonsterSerializer(MonsterSerializer):
    class Meta(MonsterSerializer.Meta):
        fields = ['id', 'name']

class RetrieveMonsterSerializer(ModelScrollWithArticleSerializer, MonsterSerializer):
    types = MonsterTypesSerializer(many=True)
    abilities = MinimumAbilitySerializer(many=True)
    hidden_ability = MinimumAbilitySerializer()
    evolutions = serializers.SerializerMethodField()
    pre_evolutions = serializers.SerializerMethodField()
    moveset = serializers.SerializerMethodField()

class MonsterScrollSerializer(RetrieveMonsterSerializer):
    class Meta(RetrieveMonsterSerializer.Meta):
        fields = ['id', 'likes_count', 'reposts_count', 'comments_count', 'user_liked', 
                  'user_reposted', 'user_commented', 'article', 'name', 'description', 
                  'species', 'types', 'is_current_user', 'avg_weight', 'avg_height']