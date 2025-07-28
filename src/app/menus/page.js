import styles from './menus-page.module.css';
import MenuCard from '@/components/menus/menu-card';

export default function MenusPage() {
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <MenuCard
          title="Food"
          description="Check out Lone Star's bold and smokey flavours, comfort food with a southern kick"
          download="/assets/menus/food_menu.pdf"
          view="/menus/food"
          className='food'
        />
        <MenuCard
          title="Cocktails"
          description="Fast, Fresh, and made to party! Check out OTD's cocktails on tap and shooters that pack a punch!"
          download="/assets/menus/cocktail_menu.pdf"
          view="/menus/cocktails"
          className='cocktails'
        />
        <MenuCard
          title="Beers"
          description="Something for every beer lover! Discover our selection of Craft Beersfrom top local brewers."
          download="/assets/menus/beer_menu.pdf"
          view="/menus/beer"
          className='beer'
        />
      </div>

    </div>
    
  )
}
