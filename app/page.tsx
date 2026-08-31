import { default as HomeAlternative } from './pageAlternative';
import { default as HomeBasic } from './pageBasic';
import { useAlternative } from './SELECTTEMPLATE';

export default function Home() {
  return useAlternative ? <HomeAlternative /> : <HomeBasic />;
}
