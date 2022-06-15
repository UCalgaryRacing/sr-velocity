import { Card, Figure } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';

interface MemberProps {
    src: string;
    name: string;
    description: string;
    linkedin?: string;
}

export default function Member({ src, name, description, linkedin }: MemberProps): JSX.Element {
    return (
        <div id="memberCard" style={{ paddingBottom: '20px' }}>
            <Card border="light">
                <Card.Body>
                    <Figure.Image
                        width={250}
                        height={250}
                        src={src}
                        roundedCircle
                    />
                    <Card.Title fontWeight='bold'>
                        {name}
                    </Card.Title>
                    <Card.Text style={{ opacity: '0.5' }}>
                        {description}
                    </Card.Text>
                    <div id="socialMedia">
                        {linkedin && <SocialIcon id="linkedin" url={linkedin} target="_blank" />}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}