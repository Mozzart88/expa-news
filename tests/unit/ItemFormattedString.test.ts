import assert from 'node:assert'
import { describe, it } from 'node:test'
import { ItemTitle, ItemDescription, ItemContent } from '../../src/FeedParser/ItemFormattedString.js'

describe('ItemFormattedString positive', () => {
    it('ItemTitle', () => {
        const raw = 'Mataron a Pillín Bracamonte, líder de la barra brava de Rosario Central'
        const data = new ItemTitle(raw)
        
        assert.strictEqual(data.rawValue, raw)
    })

    it('ItemDescription', () => {
        const raw = 'El jefe de la hinchada canalla fue asesinado a tiros junto a su mano derecha en inmediaciones del estadio '
        const data = new ItemDescription(raw)
        
        assert.strictEqual(data.rawValue, raw)
    })

    it('ItemContent', () => {
        const raw = '<p>&nbsp;El jefe de la barra brava Andrés "Pillín" Bracamonte fue asesinado este sábado a la noche luego del partido que disputó Rosario Central contra San Lorenzo. Desconocidos emboscaron la camioneta en la que se trasladaba junto a su mano derecha Daniel "Rana" Attardo quien también murió en el ataque.</p><p>Las internas en la tribuna canalla venían escalando. Semanas atrás, Pillín fue herido de bala luego que desconocidos en moto le dispararan en el Parque Alem, cerca de donde cayó este sábado en inmediaciones del estadio.</p><p>Pillín hacía décadas que manejaba los destinos de la barra canalla y se le atribuía haber garantizado cierta tranquilidad a través de una autoridad absoluta sobre lo que pasaba en la tribuna a diferencia de la guerra entre bandas en Newell\'s Old Boys donde se mezcla el gobierno de la hinchada y el negocio narco.</p><p >[<a href="https://www.lapoliticaonline.com/santa-fe/pillin-bracamonte-el-intocable-de-la-barra-de-central-que-ahora-esta-en-la-mira-de-la-justicia-federal/" target="_blank">Pillín Bracamonte, el intocable de la barra de Central que ahora está en la mira de la Justicia Federal</a>]</p><p>Este sábado, en la esquina de Avenida Avellaneda e Ibarlucea, fue atacado a tiros cuando se trasladaba en una camioneta blanca junto a su mano derecha "El Rana". Ambos llegaron al Hospital Centenario con heridas graves. Desde el Ministerio de Seguridad confirmaron a este medio el fallecimiento de ambos.</p><p>En el entorno del barra sospechan de una bandita de jóvenes del barrio 7 de Septiembre que tienen contactos con el narco Esteban Alvarado. En el juicio oral se expuso que Alvarado, enemigo del clan Los Monos, quiso asesinar a Pillín. Además, en el 7 de Septiembre vivía Julio Navarro, conocido como "Cara de Goma", uno de los históricos de la barra que secundó a Bracamonte durante muchos años pero el vínculo se rompió y en 2016 fue asesinado en la puerta de su casa.</p><figure class="vsmimage" ><img data- data-owidth="1200" data-oheight="910" src="https://www.lapoliticaonline.com/files/image/64/64390/5ef120538b9db_798_603!.jpg?s=61cc5b47585fdf8fa0735b07ed1cf5ff&amp;d=1731208109" width="798" height="603"><p>Pillín estuvo detenido en una causa por lavado de activos</p></figure><p>Durante el partido contra San Lorenzo, el clima en la tribuna estaba enrarecida como vine sucediendo cada domingo que Central juega de local. La barra brava de Pillín dejó el centro de la bandeja alta por unos minutos para enfrentarse con un grupo de jóvenes que serían los del 7 de Septiembre.</p><p>Semanas atrás, en la bandeja baja apareció una bandera que decía "No respetamos a nadie" y un sello con un mono con la leyenda "siempre mono nunca sapo". El trapo era un homenaje de "Los Menores" a Samuel Miqueas Median, yerno de Guille Cantero asesinado de 16 balazos a principios de octubre.</p><p>Los Menores se hacen llamar los jóvenes de Los Monos y viven en barrio 17 de Agosto. Al partido siguiente de poner la bandera en homenaje a Samu, una pandilla del barrio Puente Gallegos los agarró a las piñas y al partido siguiente no fueron. En la calle se rumoreaba que la banda del 7 de septiembre estuvo detrás del asesinato del Samu.</p><p>Pero más allá de los rumores, los investigadores no descartaban la pista de Pillín Bracamonte detrás del asesinato del Samu aunque era sabido que el barra canalla tenía muy buena relación con Los Monos que en sus años de apogeo controlaron la hinchada de NOB.&nbsp;</p><p>De 52 años, poco inclinado a mostrarse y menos a usar teléfono, Pillín había ganado el liderazgo en la barra de Central en 2002, después de un breve período de violencia que se apaciguó cuando se convirtió en el máximo jefe. Desde entonces arrancó negocios hechos de aprietes con eje en el club pero sin hechos de sangre. Ese rasgo, el de un individuo poderoso que mandaba sin ejercer violencia letal, empezó a llamar la atención en la política.&nbsp;</p><figure class="vsmimage" ><img data- data-owidth="1200" data-oheight="675" src="https://www.lapoliticaonline.com/files/image/240/240659/673025209fc44_798_442!.png?s=0ce335ec4f9195721b3556cea9879da2&amp;d=1731208482" width="798" height="442"><p>Bandera de Los Monos en la tribuna de Central</p></figure><p>En una ciudad con la tasa de homicidios más alta del país, con sus consecuentes crisis de gobernabilidad, parecía un posible modelo a intentar en otras instituciones. El fiscal provincial Miguel Moreno lo allanó por primera vez en abril de 2020 en una casa de un country en Ibarlucea, a cuatro kilómetros de Rosario.&nbsp;</p><p>Ese día Pillín saltó de la cama con la certeza de que alguien llegaba a matarlo. Al advertir los uniformes se tranquilizó. Los policías encontraron una valija repleta de dinero y, curiosidad, una máquina contadora de billetes.&nbsp;</p><p>Moreno lo acusó de lavar dinero por una cifra millonaria. Mostró la evolución comercial que lo llevó de vivir en un Fonavi de barrio a tener una gran cantidad de propiedades administradas por testaferros y vivir en un caserón de 300 metros cuadrados. Su ex mujer, Natalia Salas, había comprado tres departamentos en el edificio Altos de Alberdi entre 2012 y 2013. Un día después de adquirir el último piso se compró un BMW cero kilómetro. También varios autos para disponer en las cuatro licencias de taxis que disponía.&nbsp;</p><p>Durante más de 15 años fue muy próximo a la Banda de Los Monos. Para 2012 Pillín apareció en una foto en el cumpleaños de 15 de Mariana Cantero, hermana del líder de Los Monos, donde también posaba Daniel "Chamala" Vázquez, uno de los jefes de la barra de Newell\'s. Una especie de confirmación del pacto interclubes que asumía el negocio de la violencia y, muy en particular, el del mercado urbano de drogas que dominaban los Cantero.</p>'
        const data = new ItemContent(`<![CDATA[${raw}]]>`)

        assert.strictEqual(data.rawValue, `<![CDATA[${raw}]]>`)
    })

    it('html to toString', {todo: true, skip: true}, () => {
        const raw = '<p>&nbsp;some paragraph</p><ul><li>the</li><li>list</li></ul>'
        
        {
            const data = new ItemContent(`<![CDATA[${raw}]]>`)
            assert.strictEqual(`${data}`, "some paragraph\n- the\n- list\n")
        }
        {
            const data = new ItemContent(raw)
            assert.strictEqual(`${data}`, raw)
        }
    })

    it.todo('html to md')
    it.todo('html to text')
    it.todo('text to html')
    it.todo('text to md')
})

describe('ItemFormattedString negative', () => {
    it.todo('Invalid string')
})