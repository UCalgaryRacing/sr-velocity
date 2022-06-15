import React, { } from "react"
import { Member } from "./member"


const About: React.FC = () => {

   const teamLeads = [
      {
         name: 'Kevin',
         src: require('../assets/teamPictures/Kevin.jpg'),
         description: 'Electrical Lead'
      },
      {
         name: 'Tyler',
         src: require('../assets/teamPictures/Tyler.jpg'),
         description: 'Electrical Lead',
         linkedin: 'http://linkedin.com/in/tyler-sawatzky'
      },
      {
         name: 'Justin',
         src: require('../assets/teamPictures/Justin.jpg'),
         description: 'Software Lead',
         linkedin: 'https://www.linkedin.com/in/justintijun/'
      },
      {
         name: 'Jeremy',
         src: require('../assets/teamPictures/Jeremy.jpg'),
         description: 'Software Lead'
      }
   ];

   const teamMembers = [
      {
         name: 'Camilla',
         src: require('../assets/teamPictures/Camilla.jpg'),
         description: 'Software',
         linkedin: 'https://www.linkedin.com/in/camilla-abdrazakov-4b077b1b2/'
      },
      {
         name: 'Jon',
         src: require('../assets/teamPictures/nopic.png'),
         description: 'Software',
         linkedin: 'https://www.linkedin.com/in/jonathan-mulyk-2b91471b2/'
      },
      {
         name: 'Justin',
         src: require('../assets/teamPictures/nopic.png'),
         description: 'Software',
         linkedin: 'www.linkedin.com/in/justinf34'
      },
   ];

   const teamLeads = teamMembers.map(teamLead) => (
      <div style={{ textAlign: 'center' }}>
         <teamLead name={teamLead.name} src={teamLead.src} description={teamLead.description} linkedin={teamLead.linkedin} />
      </div>
   )

   const teamMembers = teamMember.map(member) => (
      <div style={{ textAlign: 'center' }}>
         <Member name={member.name} src={member.src} description={member.description} linkedin={member.linkedin} />
      </div>
   )
   


   this.teamLeads = this.teamLeads.map(member => {
      return <div style={{ textAlign: 'center' }}>
         <Member name={member.name} src={member.src} description={member.description} linkedin={member.linkedin} />
      </div>
   });

   this.teamMembers = this.teamMembers.map(member => {
      return <div style={{ textAlign: 'center' }}>
         <Member name={member.name} src={member.src} description={member.description} linkedin={member.linkedin} />
      </div>
   });


   return (
      <div id='aboutPage' style={{ marginTop: '80px' }}>
         <p style={{
            textAlign: 'center',
            fontSize: 'xx-large',
            borderBottomStyle: 'solid',
            borderBottomColor: '#C22E2D',
            paddingBottom: '20px',
            marginBottom: '50px'
         }}>
            Meet the Makers
         </p>
         <CardDeck style={{ justifyContent: 'center' }}>
            {this.teamLeads}
         </CardDeck>
         <CardDeck style={{ justifyContent: 'center' }}>
            {this.teamMembers}
         </CardDeck>
         <TopNav />
         <BottomNav />
      </div>
   );
};


export default About;
