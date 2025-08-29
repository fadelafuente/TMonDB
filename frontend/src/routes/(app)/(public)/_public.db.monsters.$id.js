import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';

import ArticleHeader from '../../../components/ui/Article/ArticleHeader';
import InfiniteResourceScroll from '../../../components/InfiniteScrolls/InfiniteResourceScroll';
import ReplyBar from '../../../components/Bars/ReplyBar';
import { BlockedCard } from '../../../components/Cards/BlockedCard';
import { FailedCard } from '../../../components/Cards/FailedCard';
import LoadingCard from '../../../components/Cards/LoadingCard';
import EvoChains from '../../../components/Content/EvoChains';
import MovesTab from '../../../components/Content/MovesTab';
import BlockModal from '../../../components/Modals/BlockModal';
import StatChart from '../../../components/TablesAndCharts/StatChart';
import WeaknessChart from '../../../components/TablesAndCharts/WeaknessChart';
import SocialInteractions from '../../../components/UserInteractions/SocialInteractions';
import { handleHeightConversion, handleKgToLbConversion } from '../../../functions/handlers';
import { useDeleteResource } from '../../../hooks/features/api/use-delete-resource';
import { useGetResourceById } from '../../../hooks/features/api/use-get-resource-by-id';

import '../../../assets/styling/content.css';
import '../../../assets/styling/UserProfile.css';
import '../../../assets/styling/ViewMon.css';

export default function ViewMonsterComponent() {
  const { id } = useParams();
  const { data: monster, isLoading } = useGetResourceById('monsters', id);
  const [showBlock, setShowBlock] = useState(false);
  const { data: isDeleted, mutate: setIsDeleted } = useDeleteResource('monsters');
  const [tab, setTab] = useState('stats');
  const { isAuthenticated } = useOutletContext();

  const levelMoves = [
    {method_value: 19, name: 'Fire Fang', type: 'Fire', power: 65},
    {method_value: 24, name: 'Slash', type: 'Normal', power: 70},
    {method_value: 30, name: 'Flamethrower', type: 'Fire', power: 90},
    {method_value: 37, name: 'Scary Face', type: 'Normal', Power: null},
    {method_value: 48, name: 'Inferno', type: 'Fire', power: 100},
    {method_value: 54, name: 'Flare Blitz', type: 'Fire', power: 120}
  ];

  const courseMoves = [
    {method_value: 1, name: 'Take Down', type: 'Normal', power: 90},
    {method_value: 7, name: 'Protect', type: 'Normal', power: null},
    {method_value: 58, name: 'Brick Break', type: 'Fighting', power: 75},
    {method_value: 67, name: 'Fire Punch', type: 'Fire', Power: 75},
    {method_value: 68, name: 'Thunder Punch', type: 'Electric', power: 75},
    {method_value: 78, name: 'Dragon Claw', type: 'Dragon', power: 80}
  ];

  const courseTotal = 140;

  let [feet, inches] = ['???', '???'];
  if(monster && monster.avg_height) {
    [feet, inches] = handleHeightConversion(monster.avg_height);
  }

  let lb = '???';
  if(monster && monster.avg_weight) {
    lb = handleKgToLbConversion(monster.avg_weight);
  }

  if(isLoading) {
    return (
      <div className='article-container'>
        <LoadingCard />
      </div>
    );
  }

  if(isDeleted || !monster) {
    return (
      <div className='article-container'>
        <FailedCard />
      </div>
    );
  }

  return (
    <>
      { monster.current_user_is_blocked ?
        <div className='article-container'>
          <BlockedCard creator={monster.creator} />
        </div>
      :
        monster.detail ?
          <div className='article-container'>
            <FailedCard type='Monster' />
          </div>
        :
          <div>
            <BlockModal show={ showBlock } setShow={ setShowBlock } setBlocked={ () => window.location.reload() } username={ monster ? monster.article.creator.username : null } />
            <article className='article-container'>
              <ArticleHeader data={ monster } type='Monster' setIsDeleted={ (d) => setIsDeleted(d) } setShowBlock={ (b) => setShowBlock(b) } />

              <div className='mon-info-details bottom-barrier'>
                <div className='mon-image-aspect-container'>
                    <div className='mon-image-container'>

                    </div>
                </div>
                <div className='mon-info-chart'>
                  <div className='mon-detail national-id'>
                    <div className='mon-detail-tag'>
                      National id
                    </div>
                    <div className='mon-detail-data'>
                      { monster.national_id ? monster.national_id : '???' }
                    </div>
                  </div>
                  <div className='mon-detail mon-detail-types'>
                    <div className='mon-detail-tag'>
                      Type(s)
                    </div>
                    <div className='mon-detail-data'>
                      gra gro
                    </div>
                  </div>
                  <div className='mon-detail mon-detail-species'>
                    <div className='mon-detail-tag'>
                      Species
                    </div>
                    <div className='mon-detail-data'>
                      { monster.species ? monster.species : '???' }
                    </div>
                  </div>
                  <div className='mon-detail mon-detail-region'>
                    <div className='mon-detail-tag'>
                      Region
                    </div>
                    <div className='mon-detail-data'>
                      Firstilionius
                    </div>
                  </div>
                  <div className='mon-detail mon-detail-types'>
                    <div className='mon-detail-tag'>
                      Abilities
                    </div>
                    <div className='mon-detail-data'>
                      <div className='mon-abilities'>
                        <a href='/' className='text-link'>D0T_M4ST3R</a>
                        <a href='/' className='text-link'>Synergy Master</a>
                      </div>
                    </div>
                  </div>
                  <div className='mon-detail mon-detail-types'>
                    <div className='mon-detail-tag'>
                      H. Ability
                    </div>
                    <div className='mon-detail-data'>
                      <div className='mon-abilities'>
                        <a href='/' className='text-link'>Intimidate</a>
                      </div>
                    </div>
                  </div>
                  <div className='mon-detail mon-detail-region'>
                    <div className='mon-detail-tag'>
                      Avg Ht
                    </div>
                    <div className='mon-detail-data'>
                      { feet }'{ inches }' ({ monster.avg_height ? monster.avg_height : '???' } m)
                    </div>
                  </div>
                  <div className='mon-detail mon-detail-region'>
                    <div className='mon-detail-tag'>
                      Avg Wt
                    </div>
                    <div className='mon-detail-data'>
                      { lb } lbs ({ monster.avg_weight ? monster.avg_weight : '???' } kg)
                    </div>
                  </div>
                </div>
              </div>

              <div className='bottom-barrier'>
                <div className='mon-desc-tag'>
                  Description
                </div>
                <p>
                  { monster.description ? monster.description : 'Data not found. Stay safe out there, researchers.' }
                </p>
              </div>

              <Tabs defaultActiveKey={ tab } activeKey={ tab } onSelect={ (k) => setTab(k) } fill>
                <Tab title='Stats' eventKey='stats'>
                  <StatChart />
                </Tab>
                <Tab title='Weaknesses' eventKey='weaknesses'>
                  <WeaknessChart />
                </Tab>
                <Tab title='Moves' eventKey='moves'>
                  <MovesTab levelMoves={ levelMoves } courseMoves={ courseMoves } courseTotal={ courseTotal } />
                </Tab>
                <Tab title='Evo. Chain' eventKey='evoChain'>
                  <EvoChains />
                </Tab>
              </Tabs>

              <div className='mon-interactions'>
                <SocialInteractions resource='monsters' obj={ monster } />
              </div>
            </article>
            {
              isAuthenticated ?
                <div className='reply-container'>
                  <ReplyBar parent={ monster && monster.article ? monster.article.id : null } />
                </div>
              :
                <div className='no-reply-container'></div>
            }
            <div className='comments-container article-container'>
              <InfiniteResourceScroll kwargs={ { parent: monster.article ? monster.article.id : null } } />
            </div>
          </div>
      }
    </>
  );
}