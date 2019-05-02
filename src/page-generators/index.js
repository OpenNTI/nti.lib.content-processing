import Assignment from './AssignmentPageGenerator';
import Assessment from './AssessmentPageGenerator';
import DiscussionAssignment from './DiscussionAssignmentPageGenerator';
import ExternalToolAsset from './ExternalToolAssetPageGenerator';
import RelatedWork from './RelatedWorkRefPageGenerator';

export default {
	'application/vnd.nextthought.assessment.assignment': Assignment,
	'application/vnd.nextthought.assessment.timedassignment': Assignment,
	'application/vnd.nextthought.assessment.discussionassignment': DiscussionAssignment,
	'application/vnd.nextthought.questionset': Assessment,
	'application/vnd.nextthought.naquestionset': Assessment,
	'application/vnd.nextthought.naquestionbank': Assessment,
	'application/vnd.nextthought.relatedworkref': RelatedWork,
	'application/vnd.nextthought.ltiexternaltoolasset': ExternalToolAsset
};
